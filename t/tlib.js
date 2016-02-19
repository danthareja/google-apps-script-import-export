'use strict'

const
    fs          = require('fs'),
    path        = require('path'),
    mkdirp      = require('mkdirp'),
    rimraf      = require('rimraf'),
    tape        = require('tape'),
    spawn       = require('tape-spawn'),
    _           = require('lodash')


tape.Test.prototype.match = function(actual, pattern, msg, extra) {
    this._assert(actual.match(pattern), {
        message: msg,
        operator: 'match',
        actual: actual,
        expected: pattern,
        extra: extra
    })
}


function testName(test_module) {
    return path.basename(test_module.filename, '.js').split('-')[0]
}

function testData(test_module, p) {
    return path.join(
        path.dirname(test_module.filename), testName(test_module), p)
}

function readTestData(p) {
    return fs.readFileSync(p, { encoding: 'UTF-8' })
}

function scratchFile(test_module, p) {
    const args = [process.cwd(), '.build', 't', testName(test_module)]
        .concat(Array.prototype.slice.call(arguments, 1))
    return path.join.apply(undefined, args)
}

function cleanScratchDir(test_module) {
    const scratchDir = scratchFile(test_module)
    rimraf.sync(scratchDir)
    mkdirp.sync(scratchDir)
    return scratchDir
}

function spawnInScratchDir(test_module, t, command) {
    return spawn(t, command, { cwd: scratchFile(test_module) })
}


module.exports = (test_module) => { return {
    test:               tape,
    spawn:              spawn,
    testName:           _.partial(testName, test_module),
    testData:           _.partial(testData, test_module),
    readTestData:       readTestData,
    scratchFile:        _.partial(scratchFile, test_module),
    cleanScratchDir:    _.partial(cleanScratchDir, test_module),
    spawnInScratchDir:  _.partial(spawnInScratchDir, test_module),
}}
