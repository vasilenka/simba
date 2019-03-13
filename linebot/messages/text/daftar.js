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
const templateImage = require('./../../action/templateImage')

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

              if(user.fullName) {

                let reply = template("Pilih salah satu aksi dibawah ini untuk melanjutkan proses pendaftaran 👇🏻")
                if(!user.idUrl) {
                  reply.quickReply.items.push(chooseIdAction(user._id))
                }
                if(!user.address || !user.longitude || !user.latitude) {
                  reply.quickReply.items.push(chooseAlamatAction(user._id))
                }
                if(!user.gender) {
                  reply.quickReply.items.push(chooseGenderAction(user._id))
                }
                if(!user.birthDate) {
                  reply.quickReply.items.push(calendarAction(user._id))
                }
                if(validateRegistrationData(user._id)) {
                  reply.quickReply.items.push(selesaiDaftar("Selesai daftar", user._id))
                }

                return event.reply([`Halo ${user.fullName.replace(/\b\w/g, l => l.toUpperCase())} 👋🏻`, reply])

              }

              let reply = templateImage()

              return event.reply([reply, "Mari kita mulai dengan perkenalan terlebih dahulu", "Kirim pesan dengan format \nsetnama:[spasi]nama_sesuai_ktp", "misal, setnama: Ongki Herlambang"])

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