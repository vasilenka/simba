const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')

const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const selesaiAction = require('./../../action/selesaiAction')
const batalAction = require('./../../action/batalAction')
const reportKebakaranAction = require('./../../action/reportKebakaran')
const reportStillActive = require('./../../action/reportStillActive')

module.exports = async event => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(user) {

        let report
        try {
          report = await Report.findOne({ reporter: user._id, status: 'active' }, {}, {sort : { updatedAt: -1 }})
        } catch (err) {
          report = null
        }

        if(report) {
          if(!exceedLimit(report.updatedAt)) {

            let noPhoto = report.photos.length === 0
            let noLocation = report.address === null || report.latitude === null || report.longitude === null

            if(noPhoto && noLocation) {

              let reply = reportStillActive("Kamu masih memiliki laporan aktif. Kirim foto & lokasi kebakaran untuk melengkapi laporanmu")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([reply])

            } else if (noPhoto && !noLocation) {

              let reply = reportStillActive("Kamu masih memiliki laporan aktif. Lengkapi foto kebakaran")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([reply])

            } else if (!noPhoto && noLocation) {

              let reply = reportStillActive("Kamu masih memiliki laporan aktif. Share lokasi kebakaran")
              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([reply])

            } else {

              let reply = reportStillActive("Semua data yang dibutuhkan sudah lengkap. Pilih salah satu aksi berikut")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(selesaiAction('Kirim laporan', report._id))
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([
                "Kamu masih memiliki laporan yang sedang aktif",
                reply
              ])

            }
          } else {

            report.status = 'invalid'
            await report.save()

          }
        }

        report = new Report({
          reporter: user._id
        })

        report.save()
          .then(report => {

            let replyNewReport = reportKebakaranAction()
            replyNewReport.quickReply.items.push(cameraAction())
            replyNewReport.quickReply.items.push(locationAction())
            replyNewReport.quickReply.items.push(batalAction('Batalkan laporan', report._id))
            return event.reply(replyNewReport)

          })
          .catch(err => {
            console.log(err)
            return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
          })

      }
    })
}