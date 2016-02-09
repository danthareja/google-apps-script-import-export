var colors = require('colors');
var mkdirp = require('mkdirp');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var util = require('../util')
var defaults = require('../defaults');
var manifestor = require('../manifestor');
var download = require('./download');
var Config = require('../config');

module.exports = function init(fileId, options) {
  var subdir = options.subdir || defaults.DEFAULT_SUBDIR;

  return Config.read()
    .then(function(config) { return config.addProject(fileId, subdir) })
    .then(function(config) { return config.write() })
    .then(function(config) { return config.getProject() })
    .then(download.factory)
    .catch(function(err) {
      console.log('Error running init command'.red);
      throw err;
    });
};
