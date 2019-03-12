const pull = require('lodash.pull')

const checkUser = require('./../../../helper/checkUser')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let message = event.message.text.toLowerCase().trim().split(' ')
      let name = pull(message, 'setnama:').join(' ')

      if(user) {

        user.fullName = name
        user.save()
          .then(user => {

            if(!user) {
              return Promise.reject()
            }

            return event.reply([`Nama "${user.fullName.replace(/\b\w/g, l => l.toUpperCase())}" berhasil disimpan'`])

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