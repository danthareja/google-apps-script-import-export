'use strict'

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var defaults = require('./defaults');

function Config(object) {
    if (object) this._data = object
}

Config.prototype.addProject = function(fileId, path) {
    if (this._data)
        throw new Error("Configuration already exists")
    this._data = { fileId: fileId, path: path }
}

Config.prototype.getProject = function() {
    return this._data
}

Config.read = function() {
  return fs.readFileAsync(defaults.CONFIG_NAME)
    .then(JSON.parse)
    .catch(SyntaxError, function(err) {
      console.log('Error parsing config'.red);
      throw err;
    })
    .catch(Error, function(err) {
        if (err.code !== 'ENOENT') throw err;
        return undefined;
    })
    .then((obj) => new Config(obj))
}

Config.prototype.write = function() {
  return fs.writeFileSync(
      defaults.CONFIG_NAME, JSON.stringify(this._data))
}


module.exports = Config
