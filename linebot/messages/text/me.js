const dayjs = require('dayjs')

const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

module.exports = event => {
  event.source.profile().then(function (profile) {
    return event.reply([
      `Halo, ${profile.displayName} 👋🏻`
    ])
  })
}