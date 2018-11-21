const path = require('path')

const scriptsDir = path.resolve(__dirname, '../scripts')
const templateDir = path.join(scriptsDir, 'create', 'template')
const mockPath = path.join(__dirname, '../mock')

const dir = {
  srcDir: path.resolve(__dirname, '../src'),
  templateDir,
  componentsTemplateDir: path.join(templateDir, 'component'),
  statusFile: path.resolve(__dirname, '../.status'),
  distDir: path.resolve(__dirname, '../dist'),
  distTestDir: path.resolve(__dirname, '../dist_test'),
  mockJSON: path.join(mockPath, 'mock.json'),
  testDir: path.join(__dirname, '../test')
}

module.exports = dir