const User = require('./../../models/User')



const setGenderAction = require('../action/setGenderAction')

module.exports = async (data, event, bot) => {

  let id = data.userId
  let user = await User.findById(id)

  if(user) {
    if(!user.registerProcess || user.registerProcess !== 'done') {
      let action = setGenderAction(id)
      return event.reply([action])
    }

    return event.reply(['Akunmu sudah terdaftar', 'Kirim \'Lapor\' untuk membuat laporan baru, atau kirim \'Help\' untuk bantuan'])
  }
}