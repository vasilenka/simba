const Report = require('./../../models/Report')

const checkUser = require('../../helper/checkUser')
const exceedLimit = require('../../helper/exceedLimit')

const cameraAction = require('../action/cameraAction')
const selesaiAction = require('../action/selesaiAction')
const batalAction = require('../action/batalAction')
const reportStillActive = require('../action/reportStillActive')

module.exports = async (event, bot) => {
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

        if(!report) {
          return event.reply(['Anda tidak memiliki laporan yang sedang aktif', 'Kirim \'Lapor\' untuk membuat laporan baru'])
        }

        if(!exceedLimit(report.updatedAt)) {

          report.address = event.message.address
          report.latitude = event.message.latitude
          report.longitude = event.message.latitude

          report.save()
            .then(report => {

              let reply = reportStillActive("Pilih salah satu aksi berikut")

              reply.quickReply.items.push(cameraAction())
              if(report.photos.length > 0 && report.address && report.longitude && report.latitude) {
                reply.quickReply.items.push(selesaiAction('Selesai', report._id))
              }
              reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))

              return event.reply([
                "Lokasi berhasil ditambahkan",
                "Balas pesan untuk menambahkan keterangan, atau",
                reply
              ])

            })
            .catch(err => {
              console.log(err)
              return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
            })

        } else {

          return event.reply(['Batas waktu pembuatan laporan telah habis', 'Kirim \'Lapor\' untuk membuat laporan baru'])

        }

      }

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}