const reportStillPending = require('../action/reportStillPending')
const locationAction = require('../action/locationAction')
const templateFormat = require('../action/templateFormat')

const User = require('./../../models/User')

module.exports = async (data, event, bot) => {

  console.log("Approving...")

  let id = data.userId
  let user = await User.findById(id)

  if(user) {
    if(user.role !== 'dispatcher') {
      if(!user.requestRole.role || !user.requestRole.status) {
        return event.reply(['Permintaan sudah tidak berlaku'])
      }

      bot.push(user.lineId, [`Permintaan kamu untuk menjadi seorang ${user.requestRole.role} ditolak oleh admin`])

      user.requestRole = {role: null, status: null}
      await user.save()
      return event.reply(['Permintaan berhasil ditolak'])

    }

    return event.reply(['Permintaan sudah tidak berlaku'])
  }

  return event.reply(['Maaf sedang ada gangguan, silahkan ulangi perintah anda'])
}