const setGenderAction = require('../action/setGenderAction')

module.exports = async (data, event, bot) => {

  let id = data.userId
  let action = setGenderAction(id)

  return event.reply([action])

}