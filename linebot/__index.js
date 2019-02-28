module.exports = bot => {

  bot.on('message', event => require('./messageReducer')(event, bot))

  bot.on('join', event => require('./joinReducer')(event, bot))
  bot.on('leave', event => require('./leaveReducer')(event, bot))

  bot.on('follow', event => require('./followReducer')(event, bot))
  bot.on('unfollow', event => require('./unfollowReducer')(event, bot))

  bot.on('postback', event => require('./postbackReducer')(event, bot))
  bot.on('beacon', event => require('./beaconReducer')(event, bot))

}