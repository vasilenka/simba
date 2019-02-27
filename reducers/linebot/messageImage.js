const fs = require('fs')
const dayjs = require('dayjs')

const Report = require('../../models/Report')

const exceedLimit = require('../../helper/exceedLimit')
const checkUser = require('../../helper/checkUser')

const selesaiAction = require('./action/selesaiAction')
const batalAction = require('./action/batalAction')
const cameraAction = require('./action/cameraAction')
const locationAction = require('./action/locationAction')

module.exports = (event, bot) => {
  event.message.content().then(data => {
    event.source.profile()
      .then(async incomingUser => {

        let {userId} = incomingUser
        let user = await checkUser(incomingUser)

        let report
        try {
          report = await Report.findOne({ reporter: user._id, status: 'active' }, {}, {sort : { createdAt: -1 }})
        } catch (err) {
          report = null
        }

        if(report) {
          if(!exceedLimit(report.createdAt)) {

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
                return event.reply(['Maaf, sedang ada masalah pada server kami', 'Silahkan ulangi pesanmu'])
              }
            })

            report.photos.push(urlPath)
            let updatedReport = await report.save()
            let reply = {
              "type": "text",
              "text": "Lengkapi data berikut untuk menyelesaikan laporan",
              "quickReply": {
                "items": []
              }
            }

            reply.quickReply.items.push(cameraAction('Foto'))
            reply.quickReply.items.push(locationAction())
            if(updatedReport.address && updatedReport.longitude && updatedReport.latitude) {
              reply.quickReply.items.push(selesaiAction('Selesai', updatedReport._id))
            }
            reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))

            return event.reply(['Foto berhasil ditambahkan', reply])

          } else {

            if(report.status === 'active') {
              return event.reply(['Batas waktu pembuatan laporan telah habis', 'Kirim \'Lapor\' untuk membuat laporan baru'])
            } else {
              return event.reply(['Anda tidak memiliki laporan yang sedang aktif', 'Kirim \'Lapor\' untuk membuat laporan baru'])
            }

          }
        }

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