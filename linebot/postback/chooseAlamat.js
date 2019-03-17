const reportStillPending = require('../action/reportStillPending')
const locationAction = require('../action/locationAction')
const templateFormat = require('../action/templateFormat')

module.exports = async (data, event, bot) => {

  let format = templateFormat("Untuk tambahkan alamat, kirim pesan dengan format", "ALAMAT:ALAMAT_ANDA")
  return event.reply([format, "misalnya \nalamat:Jl. Cipaheut No.6, Bandung"])

}