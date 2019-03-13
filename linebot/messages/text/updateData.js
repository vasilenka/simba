const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const checkUser = require('./../../../helper/checkUser')
const validateRegistrationData = require('./../../../helper/validateRegistrationData')

const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const calendarAction = require('./../../action/calendarAction')
const chooseGenderAction = require('../../action/chooseGenderAction')
const chooseIdAction = require('../../action/chooseIdAction')
const chooseAlamatAction = require('../../action/chooseAlamatAction')
const selesaiDaftar = require('./../../action/selesaiDaftar')

const template = require('./../../action/reportStillPending')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(user) {
        if(!user.registerProcess || user.registerProcess !== 'done') {

          user.registerProcess = 'pending'
          return user.save()
            .then(user => {

              if(!user) {
                return Promise.reject()
              }

              let reply = template('Proses pendaftarkan akan dimulai. Lengkapi datamu dengan memilih tombol aksi dibawah ini 👇🏻')

              reply.quickReply.items.push(chooseIdAction(user._id))
              reply.quickReply.items.push(chooseAlamatAction(user._id))
              reply.quickReply.items.push(chooseGenderAction(user._id))
              reply.quickReply.items.push(calendarAction(user._id))
              if(validateRegistrationData(user._id)) {
                reply.quickReply.items.push(selesaiDaftar("Selesai daftar", user._id))
              }

              return event.reply(reply)

            })
            .catch(err => {
              console.log(err)
              return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
            })

        }

        return event.reply(['Akunmu sudah terdaftar'])

      }
    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}