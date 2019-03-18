const remove = require('lodash.remove')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const config = require('./../../../config')

const checkUser = require('./../../../helper/checkUser')
const validateRegistrationData = require('./../../../helper/validateRegistrationData')
const validateUser = require('./../../../helper/validateUser')

const textTemplate = require('./../../action/textTemplate')
const calendarAction = require('./../../action/calendarAction')
const chooseGenderAction = require('../../action/chooseGenderAction')
const chooseIdAction = require('../../action/chooseIdAction')
const chooseAlamatAction = require('../../action/chooseAlamatAction')
const selesaiDaftar = require('./../../action/selesaiDaftar')
const templateFormat = require('./../../action/templateFormat')

module.exports = (event, bot) =>
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let validUser = validateUser(user, event, bot)
      let text = remove(event.message.text.toLowerCase().trim().split(' '), n => n !== 'pwd:').join(' ')

      if(user) {
        if(validUser) {
          if(user.role === 'dispatcher') {

            if(!validator.isLength(text, {min: 6, max: undefined})) {
              return event.reply([`Password kamu tidak boleh kurang dari 6 karakter`, "Silahkan ulangi perintah anda"])
            }

            user.password = text
            if(user.password) {
              return user.save()
                .then(user => {

                  if(!user) {
                    return Promise.reject()
                  }

                  // let format = templateFormat()

                  return event.reply([
                    "Password berhasil ditambahkan ke akunmu!",
                    "Jika anda lupa password, kirim pesan LUPAPASSWORD",
                    "Untuk menjaga kerahasiaan passwordmu, jangan lupa untuk menghapus pesan password",
                  ])

                })
                .catch(err => {
                  console.log(err)
                  return Promise.reject()
                })
            }
          } else {
            return event.reply([
              "Perintah ini hanya tersedia untuk admin(dispatcher)",
              "Jika kamu seorang admin(dispatcher) atau fireman, kirim pesan \'dispatcher\' atau \'fireman\' untuk mengganti akses akun anda"
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