const fs = require('fs')
const dayjs = require('dayjs')

const Report = require('./../../models/Report')
const User = require('./../../models/User')

const checkUser = require('../../helper/checkUser')
const exceedLimit = require('./../../helper/exceedLimit')

module.exports = event => {
  switch (event.message.type) {

    case 'text':
      switch (event.message.text) {
        case 'Me':
          event.source.profile().then(function (profile) {
            return event.reply('Hello ' + profile.displayName + ' ' + profile.userId + ' ' + profile.pictureUrl)
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
            "type": "text",
            "text": "Select your favorite food category or send me your location!",
            "quickReply": {
              "items": [
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

        case 'Foto':
          event.reply({
            "type": "text",
            "text": "Select your favorite food category or send me your location!",
            "quickReply": {
              "items": [
                {
                  "type": 'postback',
                  "data": 'ongkiherlamabng',
                  "action": {
                    "type": "camera",
                    "label": "Camera",
                  }
                },
              ]
            }
          })
          break

        case 'Lapor':
          event.source.profile()
            .then(async user => {

              let validatedUser = await checkUser(user)
              let report;

              try {
                report = await Report.findOne({reporter: validatedUser._id, status: 'active'})
              } catch (err) {
                console.log(err)
              }

              if(validatedUser) {

                if(report && !exceedLimit(report.updatedAt)) {

                  let noPhoto = report.photos.length === 0
                  let noLocation = report.address === null || report.latitude === null || report.longitude === null

                  if(noPhoto && noLocation) {
                    return event.reply({
                      "type": "text",
                      "text": "Kamu masih memiliki laporan yang sedang aktif, kirimkan foto kebakaran dan share lokasi kejadian untuk melengkapi laporanmu",
                      "quickReply": {
                        "items": [
                          {
                            "type": "action",
                            "action": {
                              "type": "camera",
                              "label": "Foto Kebakaran"
                            }
                          },
                          {
                            "type": "action",
                            "action": {
                              "type": "location",
                              "label": "Lokasi Kebakaran"
                            }
                          },
                        ]
                      },
                    })
                  } else if (noPhoto && !noLocation) {
                    return event.reply({
                      "type": "text",
                      "text": "Kamu masih memiliki laporan yang sedang aktif, share lokasi kejadian kebakaran untuk melengkapi laporanmu",
                      "quickReply": {
                        "items": [
                          {
                            "type": "action",
                            "action": {
                              "type": "camera",
                              "label": "Foto Kebakaran"
                            }
                          },
                        ]
                      },
                    })
                  } else if (!noPhoto && noLocation) {
                    return event.reply({
                      "type": "text",
                      "text": "Kamu masih memiliki laporan yang sedang aktif, kirimkan foto kebakaran untuk melengkapi laporanmu",
                      "quickReply": {
                        "items": [
                          {
                            "type": "action",
                            "action": {
                              "type": "location",
                              "label": "Lokasi Kebakaran"
                            }
                          },
                        ]
                      },
                    })
                  }

                } else {

                  let report = new Report({
                    reporter: validatedUser._id
                  })

                  report.save()
                    .then(report => console.log('NEW REPORT', report))
                    .catch(err => console.log(err))

                }

                event.reply({
                  "type": "flex",
                  "replyToken": event.replyToken,
                  "altText": "Laporan Baru",
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
                    // "footer": {
                    //   "type": "box",
                    //   "layout": "vertical",
                    //   "contents": [
                    //     {
                    //       "type": "separator",
                    //       "color": "#EEEEEE"
                    //     },
                    //     {
                    //       "type": "button",
                    //       "action": {
                    //         "type": "postback",
                    //         "label": "Lokasi",
                    //         "text": "Lokasi",
                    //         "data": "location"
                    //       },
                    //       "color": "#FF5A5B"
                    //     },
                    //     {
                    //       "type": "separator",
                    //       "color": "#EEEEEE"
                    //     },
                    //     {
                    //       "type": "button",
                    //       "action": {
                    //         "type": "postback",
                    //         "label": "Foto",
                    //         "text": "Foto",
                    //         "data": "photo"
                    //       },
                    //       "color": "#FF5A5B"
                    //     }
                    //   ]
                    // }
                  },
                  "quickReply": {
                    "items": [
                      {
                        "type": 'postback',
                        "data": 'ongkiherlamabng',
                        "action": {
                          "type": "camera",
                          "label": "Foto Kebakaran",
                        }
                      },
                      {
                        "type": 'postback',
                        "data": 'ongkiherlamabng',
                        "action": {
                          "type": "location",
                          "label": "Lokasi Kebakaran",
                        }
                      },
                    ]
                  },
                })

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
      event.message.content().then(data => {
        event.source.profile()
          .then(async user => {

            let {userId} = user
            let validatedUser = await checkUser(user)
            let dir = `public/images/reports/${userId}`

            if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
            }

            let filePath = `${dir}/${ dayjs(Date.now()).format('YYYYMMDD_HHmmss')+ '_' + userId}.png`

            fs.writeFile(filePath, data, (err) => {

              if(err) {
                console.log(err)
              }

              Report.findOneAndUpdate({reporter: validatedUser._id, status: 'active'},
                {
                  $push: {
                    photos: filePath
                  }
                })
                .then(report => {
                  console.log(report)
                })
                .catch(err => console.log(err))

              return event.reply('Nice picture!')

            });

          })
          .catch(err => console.log(err))

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
      console.log(event)
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