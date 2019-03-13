const Report = require('./../../models/Report')

const exceedLimit = require('../../helper/exceedLimit')
const checkUser = require('../../helper/checkUser')
const validateUser = require('../../helper/validateUser')
const validateRegistrationData = require('./../../helper/validateRegistrationData')

const cameraAction = require('../action/cameraAction')
const selesaiAction = require('../action/selesaiAction')
const batalAction = require('../action/batalAction')
const reportStillPending = require('../action/reportStillPending')
const textTemplate = require('../action/textTemplate')

const chooseIdAction = require('./../action/chooseIdAction')
const chooseAlamatAction = require('./../action/chooseAlamatAction')
const chooseGenderAction = require('./../action/chooseGenderAction')
const calendarAction = require('./../action/calendarAction')

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

        if(!user.fullName) {
          return event.reply(["Mohon ikuti langkah pendaftaran dengan benar", "Balas pesan dengan format \nsetnama:[spasi]nama_sesuai_ktp", "misal, setnama: Ongki Herlambang"])
        }

        if(!user.address) {
          user.address = event.message.address
        }

        user.latitude = event.message.latitude
        user.longitude = event.message.longitude
        return user.save()
          .then(user => {

            let location = {
              type: 'location',
              title: 'Alamat',
              address: `${user.address.replace(/\b\w/g, l => l.toUpperCase())}`,
              latitude: Number(user.latitude),
              longitude: Number(user.longitude)
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
            if(validateRegistrationData(user._id)) {
              reply.quickReply.items.push(selesaiDaftar("Selesai daftar", user._id))
            }

            return event.reply(['Titik alamatmu berhasil disimpan', location, ])

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