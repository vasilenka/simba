const fs = require('fs')
const dayjs = require('dayjs')

const Report = require('../../models/Report')

const exceedLimit = require('../../helper/exceedLimit')
const checkUser = require('../../helper/checkUser')

const selesaiAction = require('../action/selesaiAction')
const batalAction = require('../action/batalAction')
const cameraAction = require('../action/cameraAction')
const locationAction = require('../action/locationAction')
const reportStillActive = require('../action/reportStillActive')

module.exports = (event, bot) => {
  event.message.content().then(data => {
    event.source.profile()
      .then(async incomingUser => {

        let {userId} = incomingUser
        let user = await checkUser(incomingUser)

        let report
        try {
          report = await Report.findOne({ reporter: user._id, status: 'active' }, {}, {sort : { updatedAt: -1 }})
        } catch (err) {
          report = null
        }

        if(report) {
          if(!exceedLimit(report.updatedAt)) {

            let dir = `public/images/reports/${userId}`
            let urlDir = `/images/reports/${userId}`

            if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
            }

            let filePath = `${dir}/${ dayjs(Date.now()).format('YYYYMMDD_HHmmss')+ '_' + userId}.png`
            let urlPath = `${urlDir}/${ dayjs(Date.now()).format('YYYYMMDD_HHmmss')+ '_' + userId}.png`

            fs.writeFileSync(filePath, data, async err => {
              if(err) {
                console.log(err)
                return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
              }
            })

            report.photos.push(urlPath)
            let updatedReport = await report.save()
            let reply

            if(!updatedReport.address || !updatedReport.longitude || !updatedReport.latitude) {

              reply = reportStillActive("Lengkapi data berikut untuk menyelesaikan laporan")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(locationAction())
              reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
              return event.reply([
                "Foto berhasil ditambahkan",
                "Balas pesan untuk menambahkan keterangan, atau",
                reply
              ])

            } else {

              reply = reportStillActive("Pilih salah satu aksi berikut")
              reply.quickReply.items.push(cameraAction())
              reply.quickReply.items.push(selesaiAction('Selesai', updatedReport._id))
              reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
              return event.reply([
                "Foto berhasil ditambahkan",
                "Data yang dibutuhkan untuk laporan anda sudah cukup",
                "Balas pesan untuk menambahkan keterangan, atau",
                reply
              ])

            }

          } else {

            if(report.status === 'active') {
              report.status = 'invalid'
              await report.save()
              return event.reply(['Batas waktu pembuatan laporan telah habis', 'Kirim \'Lapor\' untuk membuat laporan baru'])
            }

          }
        }

        return event.reply([
            'Anda tidak memiliki laporan yang sedang aktif',
            'Kirim \'Lapor\' untuk membuat laporan baru'
          ])
          .then(data => console.log('Success', data))
          .catch(error => console.log('Error', error))

      })
      .catch(err => {
        console.log(err)
        return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
      })

  }).catch(function (err) {
    console.log(err)
    return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
  })
}