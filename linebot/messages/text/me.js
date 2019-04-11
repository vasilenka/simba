const checkUser = require('./../../../helper/checkUser')

module.exports = event => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(!user) {
        return Promise.reject()
      }

      let role;
      switch (user.role) {
        case 'volunteer':
          role = 'relawan'
          break
        case 'fireman':
          role = 'petugas'
          break
        case 'dispatcher':
          role = 'admin'
          break
        default:
          role = 'pelapor'
          break
      }

      return event.reply([
        `Halo, ${user.name} 👋🏻, kamu adalah seorang ${role}`
      ])

    })
    .catch(err => {
      console.log(err)
      return event.reply(["Maaf, sedang ada gangguan. Silahkan ulangi perintahmu"])
    })
}