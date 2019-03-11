const checkUser = require('./../../../helper/checkUser')
const validateUser = require('./../../../helper/validateUser')

const io = require('./../../../services/socketClient')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await validateUser(await checkUser(incomingUser), event, bot)
      if(user) {

        if(user.role !== 'dispatcher') {

          user.requestRole.role = 'dispatcher'
          user.requestRole.status = 'pending'

          let newUser = await user.save()

          if(newUser) {

            io.emit('new_request', newUser)
            return event.reply(["Permintaanmu akan segera kami proses"])

          } else {

            return event.reply(['Maaf sedang ada gangguan, silahkan ulangi perintah anda'])

          }
        } else {

          event.reply(["Haloo, dispatcher 👋🏻"])

        }

      }
    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}