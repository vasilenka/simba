const setGenderAction = require('../action/setGenderAction')

module.exports = async (data, event, bot) => {

  console.log('DATA: ', data)
  let id = data.userId
  let action = setGenderAction('Jenis kelamin', 'Pilih jenis kelamin anda', id)

  return event.reply([action])

}