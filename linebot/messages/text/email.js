const remove = require('lodash.remove')
const validator = require('validator')
const config = require('./../../../config')

const User = require('./../../../models/User')

const checkUser = require('./../../../helper/checkUser')
const validateRegistrationData = require('./../../../helper/validateRegistrationData')
const validateUser = require('./../../../helper/validateUser')

const textTemplate = require('./../../action/textTemplate')
const calendarAction = require('./../../action/calendarAction')
const chooseGenderAction = require('../../action/chooseGenderAction')
const chooseIdAction = require('../../action/chooseIdAction')
const chooseAlamatAction = require('../../action/chooseAlamatAction')
const selesaiDaftar = require('./../../action/selesaiDaftar')

module.exports = (event, bot) =>
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let validUser = validateUser(user, event, bot)
      let text = remove(event.message.text.toLowerCase().trim().split(' '), n => n !== 'email:').join(' ')

      if(user) {
        if(validUser) {
          if(user.role === 'dispatcher') {

            if(!validator.isEmail(text)) {
              return event.reply([`Email ${text} tidak valid`, "Silahkan ulangi perintah anda"])
            }

            let existingUser = await User.findOne({email: text})
            if(existingUser && existingUser._id !== user._id) {
              return event.reply(["Gagal mengatur email anda, email sudah terdaftar di akun lain"])
            }

            user.email = text
            return user.save()
              .then(user => {
                if(!user) {
                  return Promise.reject()
                }
                return event.reply(`Email ${user.email} berhasil ditambahkan ke akunmu!`)
              })
              .catch(err => {
                console.log(err)
                return Promise.reject()
              })

          } else {
            return event.reply([
              "Perintah ini hanya tersedia untuk admin(dispatcher)",
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