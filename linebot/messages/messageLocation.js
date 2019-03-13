const Report = require('./../../models/Report')

const exceedLimit = require('../../helper/exceedLimit')
const checkUser = require('../../helper/checkUser')
const validateUser = require('../../helper/validateUser')

const cameraAction = require('../action/cameraAction')
const selesaiAction = require('../action/selesaiAction')
const batalAction = require('../action/batalAction')
const reportStillPending = require('../action/reportStillPending')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let validUser = await validateUser(user, event, bot)

      if(user && validUser) {

        let report
        try {
          report = await Report.findOne({ reporter: user._id, status: 'pending' }, {}, {sort : { updatedAt: -1 }})
        } catch (err) {
          report = null
        }

        if(!report) {
          return event.reply(['Kamu tidak memiliki laporan yang sedang aktif. Kirim \'Lapor\' untuk membuat laporan baru'])
        }

        if(!exceedLimit(report.updatedAt)) {

          report.address = event.message.address
          report.latitude = event.message.latitude
          report.longitude = event.message.longitude

          report.save()
            .then(report => {

              if(!report.photos.length > 0) {

                let reply = reportStillPending("Balas pesan untuk menambahkan keterangan, atau pilih salah satu aksi berikut")

                reply.quickReply.items.push(cameraAction())
                if(report.photos.length > 0 && report.address && report.longitude && report.latitude) {
                  reply.quickReply.items.push(selesaiAction('Kirim laporan', report._id))
                }
                reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))

                return event.reply([
                  "✅ Lokasi berhasil ditambahkan",
                  reply
                ])

              } else {

                let reply = reportStillPending("Data yang dibutuhkan untuk laporan anda sudah cukup. Balas pesan untuk menambahkan keterangan atau pilih salah satu aksi berikut")
                reply.quickReply.items.push(cameraAction())
                reply.quickReply.items.push(selesaiAction('Kirim laporan', report._id))
                reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
                return event.reply([
                  "✅ Lokasi berhasil ditambahkan",
                  reply
                ])
              }

            })
            .catch(err => {
              console.log(err)
              return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
            })

        } else {

          return event.reply(['Batas waktu pembuatan laporan telah habis. Kirim \'Lapor\' untuk membuat laporan baru'])

        }
      }

      if(user && user.registerProcess === 'pending') {

        if(!user.address) {
          user.address = event.message.address
        }
        user.latitude = event.message.latitude
        user.longitude = event.message.longitude
        return user.save()
          .then(user => {

            let reply = {
              type: 'location',
              title: 'Alamat',
              address: `${user.address.replace(/\b\w/g, l => l.toUpperCase())}`,
              latitude: Number(user.latitude),
              longitude: Number(user.longitude)
            }

            return event.reply(['Lokasi-mu berhasil disimpan', reply])

          })
          .catch(err => {
            return Promise.reject(err)
          })

      }
    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
    })
}