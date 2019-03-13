const dayjs = require('dayjs')

const validateRegistrationData = require('./../../helper/validateRegistrationData')

const chooseIdAction = require('../action/chooseIdAction')
const chooseAlamatAction = require('../action/chooseAlamatAction')
const chooseGenderAction = require('../action/chooseGenderAction')
const calendarAction = require('../action/calendarAction')
const textTemplate = require('../action/textTemplate')

const selesaiDaftar = require('../action/selesaiDaftar')

const User = require('../../models/User')

module.exports = async (data, event, bot) => {

  let userId = data.userId
  let user = await User.findById(userId)
  if(user) {

    let birthDate = dayjs(event.postback.params.date).toString()
    user.birthDate = birthDate
    user.save()
      .then(user => {

        if(!user) {
          return Promise.reject()
        }

        if(validateRegistrationData(user)) {

          let reply = textTemplate("Data pendaftaran sudah lengkap. Pilih tombol Selesai daftar untuk menyelesaikan proses pendaftaran akun")
          reply.quickReply.items.push(selesaiDaftar('Selesai daftar', user._id))

          return event.reply([`✅ Tanggal lahirmu, ${dayjs(user.birthDate).format("DD MMMM YYYY")} berhasil disimpan`, reply])

        } else {

          let reply = textTemplate("Silahkan pilih salah satu tombol dibawah ini untuk melanjutkan proses pendaftaran akun")

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

          return event.reply([`✅ Tanggal lahirmu, ${dayjs(user.birthDate).format("DD MMMM YYYY")} berhasil disimpan`, reply])

        }
      })
      .catch(err => {

        console.log(err)

        let reply = textTemplate("Silahkan pilih salah satu tombol dibawah ini untuk melanjutkan proses pendaftaran akun")
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

        return event.reply([`Maaf sedang ada gangguan`, reply])

      })

  }

}