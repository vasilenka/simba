const checkUser = require('./../../../helper/checkUser')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      if(user.role !== 'volunteer') {

        user.requestRole.role = 'volunteer'
        user.requestRole.status = 'pending'

        let newUser = await user.save()

        if(newUser) {

          return event.reply(["Permintaanmu akan segera kami proses"])

        } else {

          return event.reply(['Maaf sedang ada gangguan, silahkan ulangi perintah anda'])

        }
      } else {

        event.reply(["Haloo, volunteer 👋🏻"])

      }

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}