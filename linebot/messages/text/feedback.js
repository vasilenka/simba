const pull = require('lodash.pull')
const config = require('./../../../config')

module.exports = (event, bot) =>
  event.source.profile()
    .then(user => {

      // let message = event.message.text.toLowerCase().trim().split(' ')
      // let feedback = pull(message, 'sendfeedback').join(' ')
      let feedback = event.message.text.toLowerCase().trim() + '\nby: ' + user.displayName

      bot.push(config.feedbackAccount, [feedback])
      return event.reply("Terima kasih sudah memberikan feedback, segala bentuk kritik dan saran akan sangat membantu untuk pengembangan layanan ini")

    })
    .catch(err => {
      console.log(err)
      return event.reply(["Maaf, sedang ada gangguan. Silahkan ulangi perintahmu"])
    })