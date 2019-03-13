const reportStillPending = require('../action/reportStillPending')
const locationAction = require('../action/locationAction')

module.exports = async (data, event, bot) => {

  return event.reply(["Kirim pesan dengan format: \nsetalamat:[spasi]alamat_anda \nuntuk menyimpan alamatmu", "misalnya \nsetalamat: Jl. Cipaheut No.6, Bandung"])

}