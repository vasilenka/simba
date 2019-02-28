const helpAction = require('./../../action/helpAction')

module.exports = async event => {
  event.source.profile()
    .then(async incomingUser => {

      let reply = helpAction()
      return event.reply(reply)

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}