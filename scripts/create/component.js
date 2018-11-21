/*
 * 创建一个component
 * @Author: Jiahao.Zhang 
 * @Date: 2018-11-13 14:31:33 
 * @Last Modified by: Jiahao.Zhang
 * @Last Modified time: 2018-11-21 10:28:56
 */

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const assign = require('object-assign');

const paths = require('../paths');
const tools = require('../tools')

const askQuestions = () => {
  const question = [
    {
      type: 'list',
      name: 'platform',
      message: '请选择组件适用平台',
      choices: [
        {
            name: 'PC&H5通用',
            value: 'C',
        },
        {
            name: 'PC',
            value: 'P',
        },
        {
            name: 'H5',
            value: 'M',
        },
      ],
    },
  ]

  return inquirer.prompt(question)
}

const askName = () => {
  const question = [
    {
      type: 'input',
      name: 'title',
      message: '请输入component的名称',
      validate: (_val) => {
        return /^[a-z][a-z\d_]*/.test(_val.trim().toLowerCase()) ? true : '请输入正确的名称'
      },
    }
  ]

  return inquirer.prompt(question)
}

const generateProject = (opt) => {
  const componentName = opt.title
  const srcDir = paths.srcDir
  const srcComponentDir = srcDir
  const templateDir = paths.componentsTemplateDir

  fs.emptyDirSync(srcDir) // 清空src文件夹

  let platform = null
  switch (opt.platform) {
    case 'C': platform = 'pch5';break;
    case 'P': platform = 'pc';break;
    case 'M': platform = 'h5';break;
  }

  fs.copySync(path.join(templateDir, platform), srcComponentDir)
  
  tools.setEditStatus(tools.EDIT_STATUS.COMPONENT, componentName)
  console.log(`创建成功! \n输入 npm run dev 即可开始开发\n输入 npm run build 即可打包`)
}

const start = () => {
  let opt = {}
  askQuestions().then(answer => {
    opt = assign({}, answer, opt)
    return askName(opt)
  }).then(answer => {
    opt = assign({}, answer, opt)
    generateProject(opt)
  })
}

module.exports = start