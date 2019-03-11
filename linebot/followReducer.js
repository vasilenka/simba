const User = require('./../models/User')

const helpAction = require('./action/helpAction')
const calendarAction = require('./action/calendarAction')
const reportStillPending = require('./action/reportStillPending')

module.exports =  async (event, bot) => {

  const userProfile = await event.source.profile()

  let {userId, displayName, pictureUrl} = userProfile

  User.findOne({lineId: userId})
    .then(user => {

      let carousel = {
        "type": "text",
        "text": "Select your favorite food category or send me your location!",
        "quickReply": {
          "items": [{
            "type": "action",
            "imageUrl": "https://example.com/sushi.png",
            "action": {
              "type":"datetimepicker",
              "label":"Select date",
              "data":"storeId=12345",
              "mode":"date",
              "initial":"1993-12-02",
              "max":"2018-12-31",
              "min":"1920-12-31"
            }
          }]
        }
      }

      let help = helpAction()

      if(user) {
        return bot.push(user.lineId, [`Selamat datang kembali, ${user.name} 👋🏻`, help])
          .then(() => event.reply([carousel]))
          .catch(err => console.log(err))
        bot.push(user.lineId, [{
          "type": "template",
          "altText": "Selamat datang di Lapor Tasik!",
          "template": {
            "type": "buttons",
            "actions": [
              {
                "type": "message",
                "label": "Location",
                "text": "Location"
              },
              {
                "type": "message",
                "label": "Photo",
                "text": "Photo"
              }
            ],
            "thumbnailImageUrl": "https://cdn.dribbble.com/users/1382369/screenshots/4144827/gif.gif",
            "title": "Buat laporan baru",
            "text": "Tambahkan data untuk membuat laporan baru"
          }
        }])
      }

      let newUser = new User({
        name: displayName,
        lineId: userId,
        profileUrl: pictureUrl,
      })

      newUser.save()
        .then(user => {
          if(!user) {
            return Promise.reject()
          }
          bot.push(user.lineId, [
            `Wilujeng ${user.name}, terima kasih telah menambahkan akun “Lapor Tasik” sebagai teman anda.`,
            help,
          ])
        })
        .catch(err => Promise.reject(err))

    })
    .catch(err => console.log(err))
}