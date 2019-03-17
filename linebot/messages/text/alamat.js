const pull = require('lodash.pull')

const checkUser = require('./../../../helper/checkUser')
const validateRegistrationData = require('./../../../helper/validateRegistrationData')

const textTemplate = require('./../../action/textTemplate')
const locationAction = require('./../../action/locationAction')

const chooseIdAction = require('./../../action/chooseIdAction')
const chooseAlamatAction = require('./../../action/chooseAlamatAction')
const chooseGenderAction = require('./../../action/chooseGenderAction')
const calendarAction = require('./../../action/calendarAction')

module.exports = async (event, bot, text) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      let address
      if(!text) {
        let message = event.message.text.toLowerCase().trim().split(' ')
        address = pull(message, 'alamat:').join(' ')
      } else {
        address = text
      }

      if(user) {

        user.address = address
        user.save()
          .then(user => {

            if(!user) {
              return Promise.reject()
            }

            if(validateRegistrationData(user)) {

              let reply = textTemplate("Semua data registrasi sudah lengkap, silahkan pilih tombol Selesai Registrasi untuk menyelesaikan proses pendaftaran akunmu")
              reply.quickReply.items.push(selesaiDaftar('Selesai daftar', user._id))

              return event.reply([`✅ Alamat berhasil disimpan`, reply])

            } else {

              if(!user.fullName) {
                return event.reply([
                  "Mohon ikuti petunjuk pendaftaran secara teratur",
                  "Balas pesan dengan format \n\nNAMA:NAMA_SESUAI_KTP\n",
                  "misal, nama: Ongki Herlambang"])
              }

              if(!user.longitude || !user.latitude) {

                let reply = textTemplate('Lanjutkan dengan pilih tombol dibawah ini untuk mengirim titik alamatmu pada peta 👇🏻')
                reply.quickReply.items.push(locationAction('Kirim lokasi'))

                return event.reply([`✅ Alamat berhasil disimpan`, reply])

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

              return event.reply(['✅ Alamat berhasil disimpan', reply])

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