const dayjs = require('dayjs')

const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')

module.exports = (event, text) => {

  event.reply(text).then(function (data) {
    event.reply('your message is: ', data)
    console.log('Success', data)
  }).catch(function (error) {
    console.log('Error', error)
  })

}