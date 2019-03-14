const reportStillPending = require('../action/reportStillPending')
const locationAction = require('../action/locationAction')

module.exports = async (data, event, bot) => {

  return event.reply(["Kirim pesan dengan format: \nSETALAMAT:[spasi]ALAMAT_ANDA \nuntuk menyimpan alamatmu", "misalnya \nsetalamat: Jl. Cipaheut No.6, Bandung"])

}