const User = require('../models/User')

module.exports = async (user, event, bot) => {

  let {
    registerProcess,
    status,
    fullName,
    birthDate,
    gender,
    address,
    longitude,
    latitude,
  } = user

  if(status === 'pending') {

    bot.push(user.lineId, ['Akunmu belum diverifikasi oleh admin. Kamu belum bisa membuat laporan baru.'])
    return false

  } else if(status === 'invalid') {

    bot.push(user.lineId, ['Data yang kamu berikan ketika registrasi tidak valid. Kirim \'Daftar\' untuk mengulangi proses registarsi.'])
    return false

  } else if(status === 'valid') {

    return true;

  } else {

    if(registerProcess === 'pending') {

      bot.push(user.lineId, ['Pendaftaran akunmu belum selesai. Kirim pesan \'Daftar\' untuk melanjutkan pendaftaran akunmu.'])
      return false

    }

    bot.push(user.lineId, ['Akunmu belum terdaftar. Kirim pesan \'Daftar\' untuk mendaftarkan akunmu.'])
    return false

  }


}