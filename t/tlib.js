const
    fs          = require('fs'),
    path        = require('path'),
    _           = require('lodash')

function testData(test_module, p) {
    const
        dir = path.dirname(test_module.filename),
        subdir = path.basename(test_module.filename, '.js').split('-')[0]
    return path.join(dir, subdir, p)
}

function readTestData(p) {
    return fs.readFileSync(p, { encoding: 'UTF-8' })
}

module.exports = (test_module) => { return {
    test:               require('tape'),
    spawn:              require('tape-spawn'),
    testData:           _.partial(testData, test_module),
    readTestData:       readTestData,
}}
