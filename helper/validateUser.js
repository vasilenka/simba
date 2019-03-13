const User = require('../models/User')

module.exports = (user, event, bot) => {

  let registerProcess = user.registerProcess
  let status = user.status

  if(status === 'pending' || status === 'valid') {

    return true

  } else if(status === 'invalid') {

    bot.push(user.lineId, ['Data yang kamu berikan ketika registrasi tidak valid. Kirim \'Daftar\' untuk mengulangi proses registarsi.'])
    return false

  }

  if(registerProcess === 'pending') {
    return false
  }

  return false

}