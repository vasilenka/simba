const express = require('express')
const router = express.Router()

const pick = require('lodash.pick')
const remove = require('lodash.remove')

const config = require('./../config')

const Report = require('./../models/Report')
const User = require('./../models/User')

const io = require('./../services/socketClient')
const bot = require('./../services/linebot')

const headerAction = require('./../linebot/action/reportHeaderAction')
const confirmAction = require('./../linebot/action/missionCompleted')
const imageAction = require('./../linebot/action/reportImageAction')

router.get('/', (req, res) => {

  Report.find()
    .sort({ createdAt: -1 })
    .populate(['reporter', 'dispatcher'])
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})

router.get('/year/:year', (req, res) => {

  let year = req.params.year

  Report.find({yearCreated: year })
    .populate(['reporter', 'dispatcher'])
    .then(reports => {
      res.status(200).send(reports)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})


router.get('/:id', (req, res) => {

  let id = req.params.id

  Report.findById(id)
    .populate(['reporter', 'dispatcher'])
    .then(report => {
      if(!report) {
        return res.status(404).send()
      }
      res.status(200).send(report)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})


router.patch('/:id', async (req, res) => {

  let id = req.params.id
  let body = pick(req.body, ['dispatcher', 'status'])
  let report = await Report.findById(id)

  if(!report) {
    return res.status(404).send()
  }

  if(body.status === 'mission' || body.status === 'invalid') {
    report.processedAt = Date.now()
  } else if(body.status === 'accomplished') {
    report.completedAt = Date.now()
  }

  report.dispatcher = body.dispatcher
  report.status = body.status
  report.save()
    .then(async report => {
      if(!report) {
        return res.status(500).send()
      }

      if(report.status === 'mission') {
        let users = await User.find()
        let firemans = await users.filter(user => user.role === 'fireman')
        let firemanId = await firemans.map(user => user.lineId)
        let usersId = await remove(users.map(user => user.lineId), firemanId)

        let carousel = {
          "type": "flex",
          "altText": "New mission 🔥",
          "contents": {
            "type": "carousel",
            "contents": []
          }
        }

        let broadcast = {
          "type": "flex",
          "altText": "Kebakaran 🔥",
          "contents": {
            "type": "carousel",
            "contents": []
          }
        }

        let reportType = report.status === "active" ? "active" : report.status === "mission" ? "missions" : "completed"
        let reportUrl = `${config.webUrl}/${reportType}/${report._id}`;
        let address = report.address
        let header = headerAction("NEW MISSION 🔥", address, reportUrl)
        let headerAlt = headerAction("BERITA KEBAKARAN 🔥", address, reportUrl)
        carousel.contents.contents.push(header)
        broadcast.contents.contents.push(headerAlt)

        let photosUrl = report.photos.map(photo => `${config.url}${photo}`)
        photosUrl.map(photo => {
          carousel.contents.contents.push(imageAction(photo))
          broadcast.contents.contents.push(imageAction(photo))
        })

        let reportConfirm = confirmAction("Apakah kebakaran sudah berhasil diatasi?", report._id)
        carousel.contents.contents.push(reportConfirm)

        bot.push(report.reporter.lineId, ["Laporan anda telah diproses. Petugas akan segera meluncur ke lokasi kebakaran."])

        bot.push(usersId, [broadcast])
        bot.push(firemanId, [carousel])

      } else if (report.status === 'invalid') {

      }

      let populatedReport = await User.populate(report, [{ path: 'dispatcher' }, {path: 'reporter'}])
      io.emit('new_report', populatedReport)
      res.status(200).json(populatedReport)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})

module.exports = router
