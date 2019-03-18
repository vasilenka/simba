const messageImage = require('./messages/messageImage')
const messageLocation = require('./messages/messageLocation')

module.exports = (event, bot) => {

  let text
  if(event.message.text) {
    text = event.message.text.toLowerCase().trim().split(' ')[0]
    console.log('TEXT: ', text)
  }

  switch (event.message.type) {

    case 'text':
      switch (text) {

        case 'me': return require('./messages/text/me')(event)

        case 'daftar': return require('./messages/text/daftar')(event, bot)
        case 'daftar:update': return require('./messages/text/updateData')(event, bot)
        case 'daftar:selesai': return

        case 'nama:': return require('./messages/text/nama')(event, bot)
        case 'alamat:': return require('./messages/text/alamat')(event, bot)
        case 'gender:choose': return
        case 'choosealamat': return
        case 'chooseid': return
        case 'setgender:laki-laki': return
        case 'set:birthdate': return
        case 'setgender:perempuan': return

        case '/feedback': return require('./messages/text/feedback')(event, bot)
        case '/email': return require('./messages/text/email')(event, bot)
        case '/pwd': return require('./messages/text/password')(event, bot)
        case '/pwd': return require('./messages/text/changePassword')(event, bot)

        case 'lapor': return require('./messages/text/lapor')(event, bot)
        case 'help': return require('./messages/text/help')(event)
        case 'volunteer': return require('./messages/text/requestVolunteer')(event, bot)
        case 'fireman': return require('./messages/text/requestFireman')(event, bot)
        case 'dispatcher': return require('./messages/text/requestDispatcher')(event, bot)
        case 'laporan:kirim': return
        case 'approve:dispatcher': return
        case 'deny:dispatcher': return
        case 'selesai': return
        case 'laporan:batal': return

        default:
          require('./messages/text/default')(event.message.text, event, bot, text)
          break

      }
      break

    case 'image':
      messageImage(event, bot)
      break

    case 'video':
      event.reply('Nice video!')
      break

    case 'audio':
      event.reply('Nice audio!')
      break

    case 'location':
      messageLocation(event, bot)
      break

    case 'sticker':
      event.reply({
        type: 'sticker',
        packageId: 1,
        stickerId: 1
      })
      break

    default:
      event.reply('Unknow message: ' + JSON.stringify(event))
      break

  }
}