const textTemplate = require('../action/textTemplate')
const selesaiDaftar = require('../action/selesaiDaftar')

const chooseAlamatAction = require('../action/chooseAlamatAction')
const chooseIdAction = require('../action/chooseIdAction')
const calendarAction = require('../action/calendarAction')

const User = require('../../models/User')

const validateRegistrationData = require('./../../helper/validateRegistrationData')

module.exports = async (data, event, bot) => {

  let userId = data.userId
  let user = await User.findById(userId)
  if(user) {

    user.gender = data.gender
    user.save()
      .then(user => {

        if(!user) {
          return Promise.reject()
        }
        if(!user.registerProcess || user.registerProcess !== 'done') {

          if(validateRegistrationData(user)) {

            let reply = textTemplate("Semua data registrasi sudah lengkap, silahkan pilih tombol Selesai Registrasi untuk menyelesaikan proses pendaftaran akunmu")
            reply.quickReply.items.push(selesaiDaftar('Selesai daftar', user._id))

            return event.reply([`Jenis kelamin berhasil disimpan sebagai: ${user.gender}`, reply])

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

            return event.reply([`Jenis kelamin anda berhasil disimpan sebagai: ${user.gender === 'male' ? 'Laki-laki' : 'Perempuan' }`, reply])

          }
        }

        return event.reply(['Akunmu sudah terdaftar', 'Kirim \'Lapor\' untuk membuat laporan baru, atau kirim \'Help\' untuk bantuan'])

      })
      .catch(err => {
        console.log(err)
        return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
      })

  }

}