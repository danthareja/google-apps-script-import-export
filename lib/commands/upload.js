var _ = require('lodash');
var colors = require('colors');
var google = require('googleapis');
var Promise = require('bluebird');

var defaults = require('../defaults');
var manifestor = require('../manifestor');
var authenticate = require('../authenticate');

module.exports = function upload(options) {
  console.log('Pushing back up to Google Drive...');

  var fileId; // Hold in closure to avoid promise nesting
  var storageFile = options && options['credentials'] || defaults.STORAGE_FILE;

  return manifestor.get()
    .then(function(config) {
      fileId = config.fileId;
      return manifestor.getExternalFiles(fileId, storageFile)
    })
    .then(function(externalFiles) {
      return manifestor.build(externalFiles);
    })
    .then(function(files) {
      return sendToGoogle(files, fileId, storageFile);
    })
    .then(function() {
      console.log('The latest files were successfully uploaded to your Apps Script project.'.green);
    })
    .catch(function(err) {
      console.log('Upload failed.'.red);
    });
};

function sendToGoogle(files, id, storageFile) {
  if (!files.length) {
    console.log('No Files to upload.'.red);
    throw 'manifest file length is 0';
  }

  return authenticate(storageFile)
    .then(function(auth) {
      var drive = google.drive({ version: 'v2', auth: auth });
      var options = {
        fileId: id,
        media: {
          mimeType: 'application/vnd.google-apps.script+json',
          body: JSON.stringify({ files: files })
        }
      };

      return Promise.promisify(drive.files.update)(options)
        .catch(function(err) {
          console.log('An error occured while running upload command: '.red + err.message);
          throw err;
        });
    });
}
