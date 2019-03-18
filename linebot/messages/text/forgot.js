const remove = require('lodash.remove')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const config = require('./../../../config')

const checkUser = require('./../../../helper/checkUser')
const validateRegistrationData = require('./../../../helper/validateRegistrationData')
const validateUser = require('./../../../helper/validateUser')
const templateFormat = require('./../../action/templateFormat')

module.exports = (event, bot) =>
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let validUser = validateUser(user, event, bot)

      if(user) {
        if(validUser) {
          if(user.role === 'dispatcher') {
            let format = templateFormat("Untuk mengatur ulang password, silahkan kirim pesan dengan format berikut", "PWD:[spasi]password_anda")

            return event.reply([
              format
            ])

          } else {
            return event.reply([
              "Perintah ini hanya tersedia untuk admin",
              "Jika kamu seorang admin(dispatcher) atau fireman, kirim pesan \'dispatcher\' untuk mengganti akses akun anda"
            ])
          }
        }

        if(user.registrationProcess === 'pending') {
          return event.reply(['Akunmu belum terdaftar. Kirim pesan \'Daftar\' untuk mendaftarkan akunmu.'])
        }
      }

      return event.reply("Akun tidak ditemukan")

    })
    .catch(err => {
      console.log(err)
      return event.reply(["Maaf, sedang ada gangguan. Silahkan ulangi perintahmu"])
    })