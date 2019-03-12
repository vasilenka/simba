const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const checkUser = require('./../../../helper/checkUser')

const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const chooseGenderAction = require('../../action/chooseGenderAction')
const calendarAction = require('./../../action/calendarAction')

const reportStillPending = require('./../../action/reportStillPending')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(user) {

        user.registerProcess = 'pending'
        user.save()
          .then(user => {

            if(!user) {
              return Promise.reject()
            }

            let reply = reportStillPending('Proses pendaftarkan akan dimulai. Lengkapi data anda dengan memilih tombol aksi dibawah ini 👇🏻')

            reply.quickReply.items.push(cameraAction("Foto KTP"))
            reply.quickReply.items.push(locationAction("Share alamat"))
            reply.quickReply.items.push(chooseGenderAction(user._id))
            reply.quickReply.items.push(calendarAction(user._id))

            return event.reply(reply)

          })
          .catch(err => {
            console.log(err)
            return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
          })

      }

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}