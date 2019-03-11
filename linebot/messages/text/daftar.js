const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')

const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const selesaiAction = require('./../../action/selesaiAction')
const batalAction = require('./../../action/batalAction')
const reportKebakaranAction = require('./../../action/reportKebakaran')
const reportStillPending = require('./../../action/reportStillPending')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let reply = helpAction()
      return event.reply(reply)

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}