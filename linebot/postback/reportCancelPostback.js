const User = require('./../../models/User')
const Report = require('./../../models/Report')

module.exports = async (data, event, bot) => {

  let id = data.reportId
  let report

  try {
    report = await Report.findById(id)
  } catch (err) {
    report = null
  }

  if(report) {

    report.status = 'cancelled'

    try {
      report = await report.save()
    } catch (err) {
      report = null
    }

    if(report) {
      return event.reply(["Laporanmu telah dibatalkan"])
    } else {
      console.log(err)
      return event.reply(['Maaf, terjadi kesalahan', 'Silahkan ulangi pesanmu'])
    }

  }

  return event.reply(["Kamu tidak memiliki laporan yang sedang aktif", "Ketik 'Lapor' untuk membuat laporan baru"])

}