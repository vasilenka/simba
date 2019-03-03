const checkUser = require('./../../../helper/checkUser')

module.exports = event => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(!user) {
        return Promise.reject()
      }

      return event.reply([
        `Halo, ${user.name} 👋🏻, kamu adalah seorang ${user.role}`
      ])

    })
    .catch(err => {
      console.log(err)
      return event.reply(["Maaf, sedang ada gangguan. Silahkan ulangi perintahmu"])
    })
}