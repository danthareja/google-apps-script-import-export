'use strict'

const Promise = require('bluebird');
const mkdirpAsync = Promise.promisify(require('mkdirp'));
const fs = Promise.promisifyAll(require('fs'));

const util = require('../util')
const manifestor = require('../manifestor');

function download(config) {
    return mkdirpAsync(config.path)
        .then(function() {
            return manifestor.getExternalFiles(config.fileId)
        })
        .map(function(file) {
            return manifestor.writeExternalFile(file, config.path)
        })
}

function command() {
  console.log('Downloading from Google Drive...')

  return manifestor.get()
    .then(download)
    .catch(function(err) {
      console.log('Error running download command'.red);
      throw err;
    });
}

module.exports = {
    command: command,
    factory: download,
}

