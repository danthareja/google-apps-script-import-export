var _ = require('lodash');
var path = require('path');
var colors = require('colors');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var request = Promise.promisifyAll(require('request'));

var util = require('./util');
var defaults = require('./defaults');
var authenticate = require('./authenticate');

/**
  build generates a manifest to be uploaded to google drive
  @param externalFiles {Object} files in the cloud
  @return {Object} manifest
 */
var build = function(externalFiles) {
  return getConfig().get('path')
    .then(util.getFilesFromDisk)
    .then(function(files) {

      // for each manifest file, if it has an equivalent on disk, keep it
      // otherwise trash it
      var filesToUpload = _.filter(externalFiles, function(externalFile) {
        return util.hasFileOnDisk(files, externalFile);
      });

      _.each(files, function(file) {
        // Add new file or update existing record
        var manifestFile = getFileInManifest(filesToUpload, file);
        if (manifestFile === undefined) {
          // add
          filesToUpload.push({
            name: file.name,
            type: util.getFileType(file),
            source: file.content
          });

        } else {
          // update
          util.updateFileSource(manifestFile, file);
        }
      });

      return filesToUpload;
    });
};

function getFileInManifest(files, file) {
  return _.findWhere(files, {
    name: file.name,
    type: util.getFileType(file)
  });
}

function getExternalFiles(fileId) {
  return authenticate()
    .then(function(auth) {
      return getProjectFiles(fileId, auth);
    })
    .catch(function(err) {
      console.log('Script file ID not found. Please input an ID and try again.'.red);
      throw err;
    });
}

function writeExternalFile(file, dir) {
  var filename = file.name + util.getFileExtension(file)
  return fs.writeFileAsync(dir + '/' + filename, file.source)
    .catch(function(err) {
      console.log('Could not write file ' + filename);
      throw err;
    })
}

function getProjectFiles(fileId, auth) {
  var google = require('googleapis');
  var drive = google.drive({ version: 'v3', auth: auth });
  var options = {
      'fileId': fileId,
      'mimeType': 'application/vnd.google-apps.script+json'
  }
  return Promise.promisify(drive.files.export)(options)
    .then(function(args) {
      const body = args[0]
      const response = args[1]
      if (!body.files) {
        throw 'Looks like there are no files associated with this project. Check the id and try again.';
      }
      return project.files;
    })
    .catch(SyntaxError, function(err) {
      console.log('Error parsing project files'.red);
      throw err;
    })
    .error(function(err){ 
      throw err;
    });
}

function getConfig() {
  return fs.readFileAsync(defaults.CONFIG_NAME)
    .then(JSON.parse)
    .catch(SyntaxError, function(err) {
      console.log('Error parsing config'.red);
      throw err;
    })
    .error(function(err) {
      console.log('Config does not exist'.red);
      throw err;
    });
}

module.exports.build = build;
module.exports.get = getConfig;
module.exports.getExternalFiles = getExternalFiles;
module.exports.writeExternalFile = writeExternalFile;
