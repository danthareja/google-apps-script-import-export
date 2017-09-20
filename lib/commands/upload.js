var _ = require('lodash');
var colors = require('colors');
var google = require('googleapis');
var Promise = require('bluebird');

var defaults = require('../defaults');
var manifestor = require('../manifestor');
var authenticate = require('../authenticate');

module.exports = function upload(options) {
  // console.log(options)
  console.log('Pushing back up to Google Drive...');

  var fileId; // Hold in closure to avoid promise nesting

  return manifestor.get()
    .then(function(config) {
      fileId = config.fileId;
      return manifestor.getExternalFiles(fileId)
    })
    .then(function(externalFiles) {
      return manifestor.build(externalFiles);
    })
    .then(function(files) {
      return sendToGoogle(files, fileId, options.teamdrive);
    })
    .then(function() {
      console.log('The latest files were successfully uploaded to your Apps Script project.'.green);
    })
    .catch(function(err) {
      console.log('Upload failed.'.red);
    });
};

function sendToGoogle(files, id, supportsTeamDrives) {
  if (!files.length) {
    console.log('No Files to upload.'.red);
    throw 'manifest file length is 0';
  }

  return authenticate()
    .then(function(auth) {
      var options = {
        fileId: id,
        media: {
          mimeType: 'application/vnd.google-apps.script+json',
          body: JSON.stringify({ files: files })
        }
      };

      if (supportsTeamDrives) {
        console.log('teamdrive=true')
        options.supportsTeamDrives = true;
      }

      var drive = google.drive({ version: 'v2', auth: auth });
      return Promise.promisify(drive.files.update)(options)
        .catch(function(err) {
          console.log('An error occured while running upload command: '.red + err.message);
          throw err;
        });
    });
}
