/*
 * 创建一个库
 * @Author: Jiahao.Zhang 
 * @Date: 2018-11-13 14:31:33 
 * @Last Modified by: Jiahao.Zhang
 * @Last Modified time: 2018-11-21 10:15:15
 */

const component = require('./component')
const tools = require('../tools')

/**
 * 初始化，会判断当前是否在开发中
 */
const start = () => {
  const last = tools.getEditStatus()

  if (last !== null) {
    tools.askContinue(last.type, last.name)
      .then(answer => {
        if (answer.choice) {
          component()
        }
      })
  } else {
    component()
  }
}

start()