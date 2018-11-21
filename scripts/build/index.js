const rollup = require('rollup')
const path = require('path')
const ora = require('ora')
const fs = require('fs-extra')
const rollupConfig = require('../../config/rollup.config')
const tools = require('../tools')
const paths = require('../paths')

const editStatus = tools.getEditStatus()

if (editStatus === null) {
  console.log('当前并未在编辑任何组件!')
  return
}

const { name } = editStatus

const config = rollupConfig(path.join(paths.srcDir, 'index.js'))
const inputOptions = {
  input: config.input,
  plugins: config.plugins
}

const outputOptions = {
  name,
  file: path.join(paths.distDir, 'index.js'),
  format: config.output.format,
}

const spinner = ora('Loading...').start()

rollup.rollup(inputOptions)
  .then(bundle => {
    fs.emptyDirSync(paths.distDir)
    // 打包
    return bundle.write(outputOptions)
  }).then(_ => {
    spinner.succeed('success !')
  }).catch(e => {
    console.error(e)
    spinner.succeed('error !')
  })
