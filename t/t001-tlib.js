'use strict'
const tlib = require('./tlib')(module)

tlib.test('testName', (t) => {
    t.equal(tlib.testName(), 't001')
    t.end()
})

tlib.test('readTestData', (t) => {
    t.equal('A file containing expected output.\n',
        tlib.readTestData(tlib.testData('expected')))
    t.end()
})

tlib.test('scratchFile', (t) => {
    const path = require('path')
    const expected = path.join('.build', 't', 't001', 'abc', 'def')
    t.equal(
        tlib.scratchFile('abc', 'def').substr(0 - expected.length),
        expected)
    t.end()
})
