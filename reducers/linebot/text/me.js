const dayjs = require('dayjs')

const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')

module.exports = event => {
  event.source.profile().then(function (profile) {
    return event.reply([
      `Halo, ${profile.displayName} 👋🏻`
    ])
  })
}

// profile.userId
// profile.pictureUrl