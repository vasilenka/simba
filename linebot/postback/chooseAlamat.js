const reportStillPending = require('../action/reportStillPending')
const locationAction = require('../action/locationAction')

module.exports = async (data, event, bot) => {

  return event.reply(["Kirim pesan dengan format: \nALAMAT:[spasi]ALAMAT_ANDA \nuntuk menyimpan alamatmu", "misalnya \nalamat: Jl. Cipaheut No.6, Bandung"])

}