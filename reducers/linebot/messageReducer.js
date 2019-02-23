module.exports = event => {
  switch (event.message.type) {

    case 'text':
      switch (event.message.text) {
        case 'Me':
          event.source.profile().then(function (profile) {
            return event.reply('Hello ' + profile.displayName + ' ' + profile.userId + ' ' + profile.pictureUrl)
          })
          break
        case 'Member':
          event.source.member().then(function (member) {
            return event.reply(JSON.stringify(member))
          })
          break
        case 'Picture':
          event.reply({
            type: 'image',
            originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
            previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
          })
          break
        case 'Location':
          event.reply({
            type: 'location',
            title: 'LINE Plus Corporation',
            address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
            latitude: 13.7202068,
            longitude: 100.5298698
          })
          break
        case 'Ongki':
          return event.reply('Herlambang')
        case 'Push':
          bot.push('U17448c796a01b715d293c34810985a4c', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)])
          break
        case 'Push2':
          bot.push('Cba71ba25dafbd6a1472c655fe22979e2', 'Push to group')
          break
        case 'Multicast':
          bot.push(['U17448c796a01b715d293c34810985a4c', 'Cba71ba25dafbd6a1472c655fe22979e2'], 'Multicast!')
          break
        case 'Confirm':
          event.reply({
            type: 'template',
            altText: 'this is a confirm template',
            template: {
              type: 'confirm',
              text: 'Are you sure?',
              actions: [{
                type: 'message',
                label: 'Yes',
                text: 'yes'
              }, {
                type: 'message',
                label: 'No',
                text: 'no'
              }]
            }
          })
          break
        case 'Multiple':
          return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'])
          break
        case 'Version':
          event.reply('linebot@' + require('./package.json').version)
          break

        case 'Lokasi':
          event.reply({
            "type": "text", // ①
            "text": "Select your favorite food category or send me your location!",
            "quickReply": { // ②
              "items": [
                {
                  "type": "action", // ④
                  "action": {
                    "type": "location",
                    "label": "Send location"
                  }
                }
              ]
            }
          })
          break

        case 'Foto':
          console.log('EVENT: ', event)
          event.message.content().then(content => console.log('CONTENT: ', content))
          event.reply().then(reply => console.log('REPLY: ', reply))
          console.log('MEMBER: ', event.source.member())
          event.source.profile().then(v => console.log('PROFILE: ', v))
          event.reply({
            "type": "text",
            "text": "Select your favorite food category or send me your location!",
            "quickReply": {
              "items": [
                {
                  "type": "action",
                  "action": {
                    "type": "camera",
                    "label": "Camera",
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type": "cameraRoll",
                    "label": "Camera roll",
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type": "location",
                    "label": "Send location"
                  }
                }
              ]
            }
          })
          break

        case 'Lapor':
          event.reply({
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Laporkan Kebakaran",
                    "margin": "md",
                    "size": "xl",
                    "align": "start",
                    "weight": "bold",
                    "wrap": true
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Lengkapi data yang dibutuhkan berikut:",
                    "align": "start",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "separator",
                    "color": "#EEEEEE"
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "postback",
                      "label": "Lokasi",
                      "text": "Lokasi",
                      "data": "location"
                    },
                    "color": "#FF5A5B"
                  },
                  {
                    "type": "separator",
                    "color": "#EEEEEE"
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "postback",
                      "label": "Foto",
                      "text": "Foto",
                      "data": "photo"
                    },
                    "color": "#FF5A5B"
                  }
                ]
              }
            }
          })
          break

        default:
          event.reply(event.message.text).then(function (data) {
            event.reply('your message is: ', data)
            console.log('Success', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
          break
      }
      break

    case 'image':
      event.message.content().then(function (data) {
        const s = data.toString('hex').substring(0, 32)
        return event.reply('Nice picture! ' + s)
      }).catch(function (err) {
        return event.reply(err.toString())
      })
      break

    case 'video':
      event.reply('Nice video!')
      break

    case 'audio':
      event.reply('Nice audio!')
      break

    case 'location':
      event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude])
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