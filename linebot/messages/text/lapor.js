const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')

const checkUser = require('./../../../helper/checkUser')
const validateUser = require('./../../../helper/validateUser')

const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const selesaiAction = require('./../../action/selesaiAction')
const batalAction = require('./../../action/batalAction')
const reportKebakaranAction = require('./../../action/reportKebakaran')
const reportStillPending = require('./../../action/reportStillPending')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await validateUser(await checkUser(incomingUser), event, bot)

      if(user) {

        let report
        try {
          report = await Report.findOne({ reporter: user._id, status: 'pending' }, {}, {sort : { updatedAt: -1 }})
        } catch (err) {
          report = null
        }

        if(report) {
          if(!exceedLimit(report.updatedAt)) {

            let noPhoto = report.photos.length === 0
            let noLocation = report.address === null || report.latitude === null || report.longitude === null

            if(noPhoto && noLocation) {

              let reply = reportStillPending("Kamu masih memiliki laporan aktif. Kirim foto & lokasi kebakaran untuk melengkapi laporanmu")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([reply])

            } else if (noPhoto && !noLocation) {

              let reply = reportStillPending("Kamu masih memiliki laporan aktif. Lengkapi foto kebakaran")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([reply])

            } else if (!noPhoto && noLocation) {

              let reply = reportStillPending("Kamu masih memiliki laporan aktif. Share lokasi kebakaran")
              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
              return event.reply([reply])

            } else {

              let reply = reportStillPending("Semua data yang dibutuhkan sudah lengkap. Pilih salah satu aksi berikut")
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