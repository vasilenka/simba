const actionTemplate = require('../action/setGenderAction')

const User = require('../../models/User')

module.exports = async (data, event, bot) => {

  let userId = data.userId
  let user = await User.findById(userId)
  if(user) {

    user.gender = data.gender
    user.save()
      .then(user => {

        if(!user) {
          return Promise.reject()
        }

        return event.reply(['Jenis kelamin berhasil disimpan'])

      })
      .catch(err => {
        console.log(err)
        return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
      })

  }

}