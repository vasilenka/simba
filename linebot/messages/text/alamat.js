const pull = require('lodash.pull')
const checkUser = require('./../../../helper/checkUser')

const template = require('./../../action/reportStillPending')
const locationAction = require('./../../action/locationAction')

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

            let reply = template('Lanjutkan dengan pilih tombol dibawah ini untuk mengirim titik alamatmu pada peta 👇🏻')
            reply.quickReply.items.push(locationAction('Kirim lokasi'))

            return event.reply([`Alamat berhasil disimpan`, reply])

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