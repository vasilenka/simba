const User = require('./../../../models/User')
const Report = require('./../../../models/Report')

const confirmAction = require('./../action/reportConfirmAction')
const imageAction = require('./../action/reportImageAction')
const headerAction = require('./../action/reportHeaderAction')

module.exports = async (data, event, bot) => {

  let users = await User.find()
  let usersId = users.map(user => user.lineId)

  let id = data.reportId
  let report

  try {
    report = await Report.findById(id)
  } catch (err) {
    report = null
  }

  if(report) {

    report.status = 'done'
    report = await report.save()

    let carousel = {
      "type": "flex",
      "altText": "Flex Message",
      "contents": {
        "type": "carousel",
        "contents": []
      }
    }

    let reportUrl = `https://32a5f7ba.ngrok.io/reports/${report._id}`;
    let address = report.address
    let header = headerAction("KEBAKARAN 🔥", address, reportUrl)
    carousel.contents.contents.push(header)

    let photosUrl = report.photos.map(photo => `https://32a5f7ba.ngrok.io${photo}`)
    photosUrl.map(photo => carousel.contents.contents.push(imageAction(photo)))

    let reportConfirm = confirmAction("Apakah benar terjadi kebakaran?", report._id)
    carousel.contents.contents.push(reportConfirm)

    event.reply(["Terima kasih, laporan anda akan segera kami proses"])
    return bot.push(usersId, [carousel])

  }

  return event.reply(["Anda tidak memiliki laporan yang sedang aktif", "Ketik 'Lapor' untuk membuat laporan baru"])

}