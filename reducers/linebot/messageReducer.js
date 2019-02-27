const fs = require('fs')
const dayjs = require('dayjs')

const Report = require('./../../models/Report')
const User = require('./../../models/User')

const checkUser = require('../../helper/checkUser')

const messageImage = require('./messageImage')
const messageLocation = require('./messageLocation')

module.exports = (event, bot) => {
  switch (event.message.type) {

    case 'text':
      switch (event.message.text) {

        case 'Me': return require('./text/me')(event)
        case 'Location': return require('./text/location')(event)
        case 'Lapor': return require('./text/lapor')(event)
        case 'Selesai': return
        case 'Batalkan laporan': return

        default:
          require('./text/default')(event, event.message.text)
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