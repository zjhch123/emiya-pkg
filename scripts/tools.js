const paths = require('./paths')
const fs = require('fs-extra')
const inquirer = require('inquirer')

module.exports = {
  EDIT_STATUS: {
    COMPONENT: 'component'
  },
  emptySrc() {
    fs.emptyDirSync(paths.srcDir)
  },
  getEditStatus() {
    const flag = fs.existsSync(paths.statusFile)
    if (!flag) {
      return null
    }
    const fileContent = fs.readFileSync(paths.statusFile, { encoding: 'utf-8' })
    try {
      const [ type, name ] = fileContent.split('|')
      return {
        type, name
      }
    } catch (e) {
      return null
    }
  },
  setEditStatus(type, name) {
    try {
      this.removeEditStatus()
      fs.writeFileSync(paths.statusFile, `${type}|${name}`, { encoding: 'utf-8', flag: 'w+' })
    } catch (e) {
      console.log(e)
    }
  },
  removeEditStatus() {
    const flag = fs.existsSync(paths.statusFile)
    if (!flag) {
      return
    }
    fs.removeSync(paths.statusFile)
  },
  askContinue(type, name) {
    const question = [
      {
        type: 'list',
        name: 'choice',
        message: `当前正在开发${name}, 是否继续操作？(继续操作会删除之前的开发文件)`,
        choices: [
          {
            name: '是',
            value: true
          },
          {
            name: '否',
            value: false
          }
        ]
      }
    ]
    return inquirer.prompt(question)
  }
}