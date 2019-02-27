const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')

const cameraAction = require('./../action/cameraAction')
const locationAction = require('./../action/locationAction')
const selesaiAction = require('./../action/selesaiAction')
const batalAction = require('./../action/batalAction')
const reportKebakaranAction = require('./../action/reportKebakaran')

module.exports = async event => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(user) {

        let report

        try {
          report = await Report.findOne({ reporter: user._id, status: 'active' }, {}, {sort : { createdAt: -1 }})
        } catch (err) {

        }

        if(report) {
          if(!exceedLimit(report.updatedAt)) {

            let noPhoto = report.photos.length === 0
            let noLocation = report.address === null || report.latitude === null || report.longitude === null

            if(noPhoto && noLocation) {

              let reply = {
                "type": "text",
                "text": "Kamu masih memiliki laporan yang sedang aktif, kirimkan foto kebakaran dan share lokasi kejadian untuk melengkapi laporanmu",
                "quickReply": {
                  "items": []
                },
              }

              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))

              return event.reply(reply)

            } else if (noPhoto && !noLocation) {

              let reply = {
                "type": "text",
                "text": "Kamu masih memiliki laporan yang sedang aktif, kirimkan foto kebakaran untuk melengkapi laporanmu",
                "quickReply": {
                  "items": []
                },
              }

              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))

              return event.reply(reply)

            } else if (!noPhoto && noLocation) {

              let reply = {
                "type": "text",
                "text": "Kamu masih memiliki laporan yang sedang aktif, share lokasi kejadian kebakaran untuk melengkapi laporanmu",
                "quickReply": {
                  "items": []
                },
              }

              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))

              return event.reply(reply)
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
            // replyNewReport.quickReply.items.push(selesaiAction('Selesai', report._id))
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