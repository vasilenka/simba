const pull = require('lodash.pull')
const checkUser = require('./../../../helper/checkUser')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let message = event.message.text.toLowerCase().trim().split(' ')
      let address = pull(message, 'setalamat:').join(' ')

      if(user) {

        user.address = address
        user.save()
          .then(user => {

            if(!user) {
              return Promise.reject()
            }

            return event.reply(["Alamat kamu berhasil disimpan", user.address.replace(/\b\w/g, l => l.toUpperCase())])

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