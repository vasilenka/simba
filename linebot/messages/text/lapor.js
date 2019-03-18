const Report = require('./../../../models/Report')

const exceedLimit = require('./../../../helper/exceedLimit')
const checkUser = require('./../../../helper/checkUser')
const validateUser = require('./../../../helper/validateUser')

const cameraAction = require('./../../action/cameraAction')
const locationAction = require('./../../action/locationAction')
const selesaiAction = require('./../../action/selesaiAction')
const batalAction = require('./../../action/batalAction')
const reportKebakaranAction = require('./../../action/reportKebakaran')
const reportStillPending = require('./../../action/reportStillPending')

const textTemplate = require('./../../action/textTemplate')
const chooseIdAction = require('./../../action/chooseIdAction')
const chooseAlamatAction = require('./../../action/chooseAlamatAction')
const chooseGenderAction = require('./../../action/chooseGenderAction')
const calendarAction = require('./../../action/calendarAction')
const templateImage = require('./../../action/templateImage')
const templateFormat = require('./../../action/templateFormat')
const reportGreetings = require('./../../action/reportGreetings')

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let validUser = validateUser(user, event, bot)

      if(user && validUser) {

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

        return report.save()
          .then(report => {

            let image = reportGreetings()
            let reply = textTemplate("Silahkan pilih aksi dibawah ini untuk melengkapi data laporanmu 👇🏻")

            reply.quickReply.items.push(cameraAction())
            reply.quickReply.items.push(locationAction())
            reply.quickReply.items.push(batalAction('Batalkan laporan', report._id))
            return event.reply([image, "Kamu akan membuat laporan baru", reply])

          })
          .catch(err => {
            console.log(err)
            return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
          })

      }

      if(user.registerProcess === 'pending') {

        if(!user.fullName) {
          let image = templateImage()
          let format = templateFormat("Kirim pesan dengan format", "NAMA:NAMA_SESUAI_KTP")
          return event.reply([
            image,
            "Proses pendaftaran akunmu belum selesai",
            "Mari kita mulai dengan perkenalan terlebih dahulu",
            format,
            "misal, nama:Ongki Herlambang"
          ])
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

    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}