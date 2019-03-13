const dayjs = require('dayjs')

const validateRegistrationData = require('./../../helper/validateRegistrationData')

const actionTemplate = require('../action/setGenderAction')
const textTemplate = require('../action/textTemplate')

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
        if(validateRegistrationData(user._id)) {
          reply.quickReply.items.push(selesaiDaftar("Selesai daftar", user._id))
        }

        return event.reply([`Tanggal lahirmu, ${dayjs(user.birthDate).format("DD MMMM YYYY")} berhasil disimpan`, reply])

      })
      .catch(err => {
        console.log(err)
        return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
      })

  }

}