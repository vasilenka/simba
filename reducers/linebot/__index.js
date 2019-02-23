module.exports = bot => {

  bot.on('message', require('./messageReducer'))

  bot.on('join', require('./joinReducer'))
  bot.on('leave', require('./leaveReducer'))

  bot.on('follow', require('./followReducer'))
  bot.on('unfollow', require('./unfollowReducer'))

  bot.on('postback', require('./postbackReducer'))
  bot.on('beacon', require('./beaconReducer'))

}