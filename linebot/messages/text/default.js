const dayjs = require('dayjs')

const Report = require('./../../../models/Report')
const User = require('./../../../models/User')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')

const reportStillActive = require('./../../action/reportStillActive')
const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const batalAction = require('./../../action/batalAction')
const selesaiAction = require('./../../action/selesaiAction')

module.exports = (event, text) => {
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

            report.keterangan.push(text)
            return report.save()
              .then(updatedReport => {

                if(!updatedReport) {
                  return Promise.reject()
                }

                let noPhoto = updatedReport.photos.length === 0
                let noLocation = updatedReport.address === null || updatedReport.latitude === null || updatedReport.longitude === null

                if(noPhoto && noLocation) {

                  let reply = reportStillActive("Kirim foto dan share lokasi kebakaran untuk melengkapi laporanmu")
                  reply.quickReply.items.push(cameraAction())
                  reply.quickReply.items.push(locationAction())
                  reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                  return event.reply(["Keterangan laporan berhasil ditambahkan", reply])

                } else if (noPhoto && !noLocation) {

                  let reply = reportStillActive("Kirim foto kebakaran untuk melengkapi laporanmu")
                  reply.quickReply.items.push(cameraAction())
                  reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                  return event.reply(["Keterangan laporan berhasil ditambahkan", reply])

                } else if (!noPhoto && noLocation) {

                  let reply = reportStillActive("Share lokasi kebakaran untuk melengkapi laporanmu")
                  reply.quickReply.items.push(locationAction())
                  reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                  return event.reply(["Keterangan laporan berhasil ditambahkan", reply])

                } else {

                  let reply = reportStillActive("Semua data yang dibutuhkan sudah lengkap. Pilih salah satu aksi berikut")
                  reply.quickReply.items.push(cameraAction())
                  reply.quickReply.items.push(selesaiAction('Kirim laporan', updatedReport._id))
                  reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                  return event.reply([
                    "Keterangan laporan berhasil ditambahkan",
                    reply
                  ])

                }

              })
              .catch(err => {
                console.log(err)
                return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
              })

          } else {

            if(report.status === 'active') {
              report.status = 'invalid'
              await report.save()
              return event.reply(['Batas waktu pembuatan laporan telah habis. Kirim \'Lapor\' untuk membuat laporan baru'])
            }

          }
        }

        return event.reply([
            'Perintah tidak tersedia. \nKirim \'Lapor\' untuk membuat laporan baru, atau kirim \'Help\' untuk bantuan',
          ])
          .then(data => console.log('Success', data))
          .catch(error => console.log('Error', error))

      }

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })

}