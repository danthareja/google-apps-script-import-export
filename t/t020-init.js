'use strict'
const tlib = require('./tlib')(module),
      fs   = require('fs')

// GDrive publicly readable test file made available by <cjs@cynic.net>.
// (In the long run we should probably create our own test files.)
const docId = '1CodFWMEXI-5MfzNniEe8Uw8pSi82Iz0uU_jdbUvs2YpAIVmNqb-aH-Xg'

tlib.cleanScratchDir()

tlib.test('gas init', function(t) {
    const cmd = tlib.spawnInScratchDir(t, '../../../bin/gas init ' + docId)
    cmd.stdout.match('')
    cmd.end()
})

tlib.test('check init content', t => {
    const expected =
        '// GAScode.gs from node-google-apps-script Public Test GAS Project'
    const buffer = fs.readFileSync(tlib.scratchFile('src/GAScode.js'))
    const lineOne = buffer.toString('utf8').split('\n')[0]
    t.equal(lineOne, expected)
    t.end()
})