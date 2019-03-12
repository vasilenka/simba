const dayjs = require('dayjs')

const actionTemplate = require('../action/setGenderAction')

const User = require('../../models/User')

module.exports = async (data, event, bot) => {

  let userId = data.userId
  let user = await User.findById(userId)
  if(user) {

    let birthDate = dayjs(event.postback.params.date).toString()
    user.birthDate = birthDate
    user.save()
      .then(user => {

        if(!user) {
          return Promise.reject()
        }

        return event.reply(['Tanggal lahir berhasil disimpan'])

      })
      .catch(err => {
        console.log(err)
        return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
      })

  }

}