const pull = require('lodash.pull')

const checkUser = require('./../../../helper/checkUser')
const validateRegistrationData = require('./../../../helper/validateRegistrationData')

const textTemplate = require('./../../action/textTemplate')
const calendarAction = require('./../../action/calendarAction')
const chooseGenderAction = require('../../action/chooseGenderAction')
const chooseIdAction = require('../../action/chooseIdAction')
const chooseAlamatAction = require('../../action/chooseAlamatAction')
const selesaiDaftar = require('./../../action/selesaiDaftar')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let message = event.message.text.toLowerCase().trim().split(' ')
      let name = pull(message, 'setnama:').join(' ')

      if(user) {

        user.fullName = name
        user.save()
          .then(user => {

            if(!user) {
              return Promise.reject()
            }

            if(validateRegistrationData(user)) {

              let reply = textTemplate("Data pendaftaran sudah lengkap. Pilih tombol \'Selesai daftar\' untuk menyelesaikan proses pendaftaran akun")
              reply.quickReply.items.push(selesaiDaftar('Selesai daftar', user._id))

              return event.reply([`Halo ${user.fullName.replace(/\b\w/g, l => l.toUpperCase())} 👋🏻`, reply])

            } else {

              let reply = textTemplate("Silahkan lengkapi data pendaftaran anda dengan memilih tombol dibawah ini 👇🏻")

              reply.quickReply.items.push(chooseIdAction(user._id))
              reply.quickReply.items.push(chooseAlamatAction(user._id))
              reply.quickReply.items.push(chooseGenderAction(user._id))
              reply.quickReply.items.push(calendarAction(user._id))

              return event.reply([`Halo ${user.fullName.replace(/\b\w/g, l => l.toUpperCase())} 👋🏻`, reply])

            }
          })
          .catch(err => {
            return Promise.reject(err)
          })

      }
    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}