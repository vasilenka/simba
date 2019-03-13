const fs = require('fs')
const dayjs = require('dayjs')

const Report = require('../../models/Report')

const exceedLimit = require('../../helper/exceedLimit')
const checkUser = require('../../helper/checkUser')
const validateUser = require('../../helper/validateUser')
const validateRegistrationData = require('../../helper/validateRegistrationData')

const selesaiAction = require('../action/selesaiAction')
const batalAction = require('../action/batalAction')
const cameraAction = require('../action/cameraAction')
const locationAction = require('../action/locationAction')
const reportStillPending = require('../action/reportStillPending')

const chooseIdAction = require('../action/chooseIdAction')
const chooseAlamatAction = require('../action/chooseAlamatAction')
const chooseGenderAction = require('../action/chooseGenderAction')
const calendarAction = require('../action/calendarAction')

const selesaiDaftar = require('./../action/selesaiDaftar')
const textTemplate = require('./../action/textTemplate')

module.exports = (event, bot) => {
  event.message.content().then(data => {
    event.source.profile()
      .then(async incomingUser => {

        let {userId} = incomingUser
        let user = await checkUser(incomingUser)
        let validUser = await validateUser(user, event, bot)

        if(user && validUser) {

          let report
          try {
            report = await Report.findOne({ reporter: user._id, status: 'pending' }, {}, {sort : { updatedAt: -1 }})
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
                  return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
                }
              })

              report.photos.push(urlPath)
              let updatedReport = await report.save()
              let reply

              if(!updatedReport.address || !updatedReport.longitude || !updatedReport.latitude) {

                reply = reportStillPending("Balas pesan untuk menambahkan keterangan, atau lengkapi data berikut untuk menyelesaikan laporan")
                reply.quickReply.items.push(cameraAction())
                reply.quickReply.items.push(locationAction())
                reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                return event.reply([
                  "✅ Foto berhasil ditambahkan",
                  reply
                ])

              } else {

                reply = reportStillPending("Data yang dibutuhkan untuk laporan anda sudah cukup. Balas pesan untuk menambahkan keterangan atau pilih salah satu aksi berikut")
                reply.quickReply.items.push(cameraAction())
                reply.quickReply.items.push(selesaiAction('Kirim laporan', updatedReport._id))
                reply.quickReply.items.push(batalAction('Batalkan laporan', updatedReport._id))
                return event.reply([
                  "✅ Foto berhasil ditambahkan",
                  reply
                ])

              }

            } else {

              if(report.status === 'pending') {
                report.status = 'invalid'
                await report.save()
                return event.reply(['Batas waktu pembuatan laporan telah habis. Kirim \'Lapor\' untuk membuat laporan baru'])
              }

            }
          }

          return event.reply([
              'Kamu tidak memiliki laporan yang sedang aktif. Kirim \'Lapor\' untuk membuat laporan baru'
            ])
            .then(data => console.log('Success', data))
            .catch(error => console.log('Error', error))

        }

        if(user && user.registerProcess === 'pending') {

          let dir = `public/images/users/${userId}`
          let urlDir = `/images/users/${userId}`

          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          let filePath = `${dir}/${ dayjs(Date.now()).format('YYYYMMDD_HHmmss')+ '_' + userId}.png`
          let urlPath = `${urlDir}/${ dayjs(Date.now()).format('YYYYMMDD_HHmmss')+ '_' + userId}.png`

          fs.writeFileSync(filePath, data, async err => {
            if(err) {
              console.log(err)
              return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
            }
          })

          user.idUrl = urlPath
          return user.save()
            .then(user => {

              let image = {
                type: 'image',
                originalContentUrl: `https://e0a12702.ngrok.io${user.idUrl}`,
                previewImageUrl: `https://e0a12702.ngrok.io${user.idUrl}`,
              };

              if(validateRegistrationData(user)) {

                let reply = textTemplate("Semua data registrasi sudah lengkap, silahkan pilih tombol Selesai Registrasi untuk menyelesaikan proses pendaftaran akunmu")

                reply.quickReply.items.push(selesaiDaftar('Selesai daftar', user._id))

                return event.reply(['Foto KTP berhasil disimpan', image, reply])

              } else {

                let reply = textTemplate("Silahkan pilih salah satu tombol dibawah ini untuk melanjutkan proses pendaftaran akun")

                reply.quickReply.items.push(chooseIdAction(user._id))
                reply.quickReply.items.push(chooseAlamatAction(user._id))
                reply.quickReply.items.push(chooseGenderAction(user._id))
                reply.quickReply.items.push(calendarAction(user._id))

                return event.reply(['Foto KTP berhasil disimpan', image, reply])

              }

            })
            .catch(err => Promise.reject(err))

        }
      })
      .catch(err => {
        console.log(err)
        return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
      })

  }).catch(function (err) {
    console.log(err)
    return event.reply(['Maaf, sedang ada gangguan. Silahkan ulangi pesanmu'])
  })
}