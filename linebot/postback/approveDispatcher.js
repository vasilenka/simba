const reportStillPending = require('../action/reportStillPending')
const locationAction = require('../action/locationAction')
const templateFormat = require('../action/templateFormat')

const User = require('./../../models/User')

module.exports = async (data, event, bot) => {

  console.log("Approving...")

  let id = data.userId
  let user = await User.findById(id)

  if(user) {
    if(user.role !== 'dispatcher') {
      if(!user.requestRole.role || !user.requestRole.status) {
        return event.reply(['Permintaan sudah tidak berlaku'])
      }

      user.role = 'dispatcher'
      user.requestRole = {role: null, status: null}
      await user.save()
      let formatEmail = templateFormat("Untuk mengatur email akunmu", "/email[spasi]contoh@email.com")
      let formatPassword = templateFormat("Untuk mengatur password akunmu", "/email[spasi]password_akunmu")

      bot.push(user.lineId, [
        `Selamat, kamu sekarang seorang ${user.role}`,
        "Silahkan atur email dan password akunmu dengan mengirim pesan sesuai format berikut:",
        formatEmail,
        formatPassword,
      ])

      return event.reply(['Approval berhasil'])
    }

    return event.reply(['Permintaan sudah tidak berlaku'])
  }

  return event.reply(['Maaf sedang ada gangguan, silahkan ulangi perintah anda'])
}