const fs = require('fs-extra')
const path = require('path')
const tools = require('./tools')
const paths = require('./paths')

tools.removeEditStatus()
fs.removeSync(paths.srcDir)
fs.removeSync(paths.distDir)
fs.removeSync(paths.distTestDir)
fs.removeSync(paths.testDir)

fs.copySync(path.join(paths.templateDir, 'test'), paths.testDir)
fs.mkdirSync(paths.srcDir)
fs.mkdirSync(paths.distDir)
fs.mkdirSync(paths.distTestDir)

console.log('Success !')