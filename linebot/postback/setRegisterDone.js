const User = require('./../../models/User')

const validateRegistrationData = require('./../../helper/validateRegistrationData')

module.exports = async (data, event, bot) => {

  let user = await User.findById(data.userId)
  let admins = await User.find({role: 'dispatcher'})
  let adminLineId = await admins.map(admin => admin.lineId)

  if(user) {
    if(validateRegistrationData(user)) {

      user.registerProcess = 'done'
      user.status = 'pending'

      user.save()
        .then(user => {

          if(!user) {
            return Promise.reject()
          }

          bot.push(adminLineId, ["New user registered. Please verify immediately!"])
          return event.reply([
            "Selamat akunmu berhasil didaftarkan", "Kamu sekarang bisa mengirim pesan \'Lapor Tasik\' untuk membuat laporan kejadian darurat, atau kirim \'help\' untuk bantuan"
          ])

        })
        .catch(err => {
          console.log(err)
          return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
        })

    }
  }

}