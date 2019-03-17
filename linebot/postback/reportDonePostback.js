const remove = require('lodash.remove')

const User = require('./../../models/User')
const Report = require('./../../models/Report')

const confirmAction = require('./../action/reportConfirmAction')
const imageAction = require('./../action/reportImageAction')
const headerAction = require('./../action/reportHeaderAction')

const config = require('./../../config')
const io = require('./../../services/socketClient')

module.exports = async (data, event, bot) => {

  let users = await User.find({$or: [{ role: "volunteer" }, { role: "dispatcher" }] })
  let usersId = users.map(user => user.lineId)

  let id = data.reportId
  let report

  try {
    report = await Report.findById(id)
  } catch (err) {
    report = null
  }

  if(report) {

    report.status = 'active'
    report = await report.save()

    let carousel = {
      "type": "flex",
      "altText": "Rangkuman laporanmu",
      "contents": {
        "type": "carousel",
        "contents": []
      }
    }

    let carouselPush = {
      "type": "flex",
      "altText": "Laporan baru, mohon dikonfirmasi",
      "contents": {
        "type": "carousel",
        "contents": []
      }
    }

    let reportType = report.status === "active" ? "active" : report.status === "mission" ? "missions" : "completed"
    let reportUrl = `${config.webUrl}/${reportType}/${report._id}`;
    let address = report.address
    let header = headerAction("KEBAKARAN 🔥", address, reportUrl)
    let headerAlt = headerAction("LAPORAN BARU 🔥", address, reportUrl)
    carousel.contents.contents.push(header)
    carouselPush.contents.contents.push(headerAlt)

    let photosUrl = report.photos.map(photo => `${config.url}${photo}`)
    photosUrl.map(photo => {
      carousel.contents.contents.push(imageAction(photo))
      carouselPush.contents.contents.push(imageAction(photo))
    })

    let reportConfirm = confirmAction("Apakah benar terjadi kebakaran?", report._id)
    carouselPush.contents.contents.push(reportConfirm)

    event.reply(["Terima kasih, laporan anda akan segera kami proses", carousel])

    io.emit('new_report', await User.populate(report, { path: 'reporter' }))

    let receiversId = remove(usersId, n => n !== report.reporter.lineId)
    return bot.push(receiversId, [carouselPush])

  }

  return event.reply(["Kamu tidak memiliki laporan yang sedang aktif. Ketik 'Lapor' untuk membuat laporan baru"])

}