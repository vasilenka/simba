const config = require('./../../config')

const User = require('./../../models/User')

const templateFormat = require('../action/templateFormat')

module.exports = async (data, event, bot) => {

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
      // let formatEmail = templateFormat("Untuk mengatur email akunmu", "EMAIL:[spasi]contoh@email.com")
      // let formatPassword = templateFormat("Untuk mengatur password akunmu", "PWD:[spasi]password_akunmu")

      let setupAccount = {
        "type": "template",
        "altText": "Pengaturan akun admin",
        "template": {
          "type": "buttons",
          "actions": [
            {
              "type": "uri",
              "label": "PENGATURAN AKUN",
              "uri": `${config.webUrl}/auth/:userid`
            }
          ],
          "thumbnailImageUrl": `${config.url}/images/icons/mail.jpg`,
          "title": "Pengaturan Akun",
          "text": "Silahkan atur akun admin anda melalui link berikut"
        }
      }

      console.log("Setup: ", setupAccount)

      bot.push(user.lineId, [
        `Selamat, kamu sekarang seorang ${user.role}`,
        setupAccount,
      ])

      // bot.push(user.lineId, [
      //   `Selamat, kamu sekarang seorang ${user.role}`,
      //   "Silahkan atur email dan password akunmu dengan mengirim pesan sesuai format berikut pada link berikut:",
      //   formatEmail,
      //   formatPassword,
      // ])

      return event.reply(['Approval berhasil'])
    }

    return event.reply(['Permintaan sudah tidak berlaku'])
  }

  return event.reply(['Maaf sedang ada gangguan, silahkan ulangi perintah anda'])
}