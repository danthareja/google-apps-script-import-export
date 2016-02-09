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
    cmd.stderr.match('')
    cmd.succeeds()
    cmd.end(() => checkProjectContent(t))
})

tlib.test('gas download', function(t) {
    const cmd = tlib.spawnInScratchDir(t, '../../../bin/gas download')
    cmd.stdout.match(/Downloading/)
    cmd.stderr.match('')
    cmd.succeeds()
    cmd.end(() => checkProjectContent(t))
})


function checkProjectContent(t) {
    const actual = fs.readFileSync(tlib.scratchFile('src/GAScode.js'), 'utf8')
    t.match(actual, / GAScode.gs /, 'Document contents')
}
