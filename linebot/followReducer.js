const User = require('./../../models/User')

module.exports =  async event => {

  const userProfile = await event.source.profile()

  let {userId, displayName, pictureUrl} = userProfile

  User.findOne({lineId: userId})
    .then(user => {
      if(user) {
        event.reply(`Welcome back, ${user.name}!`)
        event.reply({
          "type": "template",
          "altText": "this is a buttons template",
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
        })
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
          event.reply(`Welcome to Damkar SSS, ${user.name}!`)
          event.reply({
            "type": "template",
            "altText": "this is a buttons template",
            "template": {
              "type": "buttons",
              "actions": [
                {
                  "type": "message",
                  "label": "Location",
                  "text": "location"
                },
                {
                  "type": "message",
                  "label": "Photo",
                  "text": "photo"
                }
              ],
              "title": "Buat laporan baru",
              "text": "Tambahkan data untuk membuat laporan baru"
            }
          })
        })
        .catch(err => Promise.reject(err))

    })
    .catch(err => console.log(err))
}