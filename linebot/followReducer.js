const User = require('./../models/User')

const helpAction = require('./action/helpAction')
const calendarAction = require('./action/calendarAction')
const reportStillPending = require('./action/reportStillPending')

module.exports =  async (event, bot) => {

  const userProfile = await event.source.profile()

  let {userId, displayName, pictureUrl} = userProfile

  User.findOne({lineId: userId})
    .then(user => {

      let help = helpAction()

      if(user) {
        return bot.push(user.lineId, [`Selamat datang kembali, ${user.name} 👋🏻`, help])
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