const pull = require('lodash.pull')
const remove = require('lodash.remove')

const Report = require('./../../../models/Report')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')
const validateUser = require('./../../../helper/validateUser')

const textTemplate = require('./../../action/textTemplate')
const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const batalAction = require('./../../action/batalAction')
const selesaiAction = require('./../../action/selesaiAction')

const chooseIdAction = require('./../../action/chooseIdAction')
const chooseAlamatAction = require('./../../action/chooseAlamatAction')
const chooseGenderAction = require('./../../action/chooseGenderAction')
const calendarAction = require('./../../action/calendarAction')
const templateImage = require('./../../action/templateImage')
const templateFormat = require('./../../action/templateFormat')

module.exports = (text, event, bot, processedText) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)

      if(user) {
        if(validateUser(user, event, bot)) {

          let report
          try {
            report = await Report.findOne({ reporter: user._id, status: 'pending' }, {}, {sort : { updatedAt: -1 }})
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

                    let reply = textTemplate("Kirim foto dan share lokasi kebakaran untuk melengkapi laporanmu")
                    reply.quickReply.items.push(cameraAction())
                    reply.quickReply.items.push(locationAction())
                    reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                    return event.reply(["Keterangan laporan berhasil ditambahkan", reply])

                  } else if (noPhoto && !noLocation) {

                    let reply = textTemplate("Kirim foto kebakaran untuk melengkapi laporanmu")
                    reply.quickReply.items.push(cameraAction())
                    reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                    return event.reply(["Keterangan laporan berhasil ditambahkan", reply])

                  } else if (!noPhoto && noLocation) {

                    let reply = textTemplate("Share lokasi kebakaran untuk melengkapi laporanmu")
                    reply.quickReply.items.push(locationAction())
                    reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                    return event.reply(["Keterangan laporan berhasil ditambahkan", reply])

                  } else {

                    let reply = textTemplate("Semua data yang dibutuhkan sudah lengkap. Pilih salah satu aksi berikut")
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

              if(report.status === 'pending') {
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

        if(user.registerProcess === 'pending') {

          let textArray = processedText.trim().split(':')
          let newText = textArray[0]

          if(!user.fullName) {

            if(newText+':' === 'nama:') {
              let cleanText = remove(textArray, n => n !== newText)
              let fullText = remove(text.toLowerCase().trim().split(' '), n => n !== processedText)
              fullText.unshift(cleanText[0])
              let name = fullText.join(' ')
              return require('./../../messages/text/nama')(event, bot, name)
            }

            let image = templateImage()
            let format = templateFormat("Kirim pesan dengan format", "NAMA:NAMA_SESUAI_KTP")
            return event.reply([
              image,
              "Proses pendaftaran akunmu belum selesai",
              "Mari kita mulai dengan perkenalan terlebih dahulu",
              format,
              "misal, nama:Ongki Herlambang"])

          } else {

            if(newText+':' === 'nama:') {
              let cleanText = remove(textArray, n => n !== newText)
              let fullText = remove(text.toLowerCase().trim().split(' '), n => n !== processedText)
              fullText.unshift(cleanText[0])
              let name = fullText.join(' ')
              return require('./../../messages/text/nama')(event, bot, name)
            }

          }

          if(newText+':' === 'alamat:') {
            let cleanText = remove(textArray, n => n !== newText)
            let fullText = remove(text.toLowerCase().trim().split(' '), n => n !== processedText)
            fullText.unshift(cleanText[0])
            let alamat = fullText.join(' ')
            return require('./../../messages/text/alamat')(event, bot, alamat)
          }

          let reply = textTemplate("Silahkan pilih salah satu tombol dibawah ini untuk melanjutkan proses pendaftaran akun")
          if(!user.idUrl) {
            reply.quickReply.items.push(chooseIdAction(user._id))
          }
          if(!user.address || !user.longitude || !user.latitude) {
            reply.quickReply.items.push(chooseAlamatAction(user._id))
          }
          if(!user.gender) {
            reply.quickReply.items.push(chooseGenderAction(user._id))
          }
          if(!user.birthDate) {
            reply.quickReply.items.push(calendarAction(user._id))
          }

          return event.reply(['Proses pendaftaran akunmu belum selesai', reply])

        } else {
          return event.reply(['Akunmu belum terdaftar. Kirim pesan \'Daftar\' untuk mendaftarkan akunmu.'])
        }

      }
    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })

}