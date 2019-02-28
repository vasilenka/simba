const messageImage = require('./messages/messageImage')
const messageLocation = require('./messages/messageLocation')

module.exports = (event, bot) => {

  let text
  if(event.message.text) {
    text = event.message.text.toLowerCase()
  }

  switch (event.message.type) {

    case 'text':
      switch (text) {

        case 'me': return require('./messages/text/me')(event)
        case 'lapor': return require('./messages/text/lapor')(event)
        case 'help': return require('./messages/text/help')(event)
        case 'selesai': return
        case 'batalkan laporan': return

        default:
          require('./messages/text/default')(event, event.message.text)
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