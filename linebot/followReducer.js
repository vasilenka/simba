const User = require('./../models/User')

const helpAction = require('./action/helpAction')
const textTemplate = require('./action/textTemplate')
const templateImage = require('./action/templateImage')
const chooseIdAction = require('./action/chooseIdAction')
const chooseAlamatAction = require('./action/chooseAlamatAction')
const chooseGenderAction = require('./action/chooseGenderAction')
const calendarAction = require('./action/calendarAction')

module.exports =  async (event, bot) => {

  const userProfile = await event.source.profile()
  let userId = userProfile.userId
  let displayName = userProfile.displayName
  let pictureUrl = userProfile.pictureUrl

  User.findOne({lineId: userId})
    .then(user => {

      let help = helpAction()
      if(user) {

        if(user.registerProcess === 'pending') {
          if(!user.fullName) {

            let reply = templateImage()
            return bot.push(user.lineId, [
              reply,
              "Proses pendaftaran akunmu belum selesai",
              "Mari kita mulai dengan perkenalan terlebih dahulu",
              "Kirim pesan dengan format \nSETNAMA:[spasi]NAMA_SESUAI_KTP", "misal, setnama: Ongki Herlambang"
            ])

          } else {

            let image = templateImage()
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

            return bot.push(user.lineId, [image, 'Proses pendaftaran akunmu belum selesai', reply])

          }
        }

        return bot.push(user.lineId, [`Selamat datang kembali, ${user.name} 👋🏻`, help])

      }

      let newUser = new User({
        name: displayName,
        lineId: userId,
        profileUrl: pictureUrl,
      })

      newUser.save()
        .then(user => {
          if(!user) {
            return Promise.reject()
          }

          let reply = templateImage()
          return bot.push(user.lineId, [
            reply,
            `Wilujeng ${user.name}, terima kasih telah menambahkan akun “Lapor Tasik” sebagai teman anda. Untuk dapat menggunakan layanan "Lapor Tasik" dengan baik, silahkan ikuti langkah pendaftaran berikut ini secara teratur`,
            "Mari kita mulai dengan perkenalan terlebih dahulu",
            "Kirim pesan dengan format \nSETNAMA:[spasi]NAMA_SESUAI_KTP",
            "misal, setnama: Ongki Herlambang"
          ])

        })
        .catch(err => Promise.reject(err))

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}