const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const pick = require('lodash.pick')
const multer = require('multer')
const path = require('path')

const config = require('../config')

const Report = require('../models/Report')
const User = require('../models/User')
const Broadcast = require('../models/Broadcast')

const io = require('../services/socketClient')
const bot = require('../services/linebot')

const headerAction = require('../linebot/action/reportHeaderAction')
const confirmAction = require('../linebot/action/missionCompleted')
const imageAction = require('../linebot/action/reportImageAction')

const storage = multer.diskStorage({
  destination: 'public/images/broadcasts/',
  filename: (req, file, cb) => cb(
    null,
    `${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}${path.extname(file.originalname)}`
  )
})

const upload = multer({ storage: storage })

router.post('/', upload.array('broadcasts'),async (req, res) => {

  let receivers = JSON.parse(req.body.receivers).map(receiver => ({role: receiver}))

  let users = await User.find({ $or: receivers })
  let usersId = await users.map(user => user.lineId)

  let body = pick(req.body, ["title", "body", "lng", "lat", "address", "place"])
  let photos = req.files[0].filename

  let broadcast = new Broadcast({
    title: body.title,
    body: body.body,
    photos: `/images/broadcasts/${photos}`,
    address: body.address,
    latitude: body.lat,
    longitude: body.lng,
    place: body.place
  })

  res.status(200).send()

  return broadcast.save()
    .then(message => {

      let broadcastMessage = {
        "type": "flex",
        "altText": message.title,
        "contents": {
          "type": "bubble",
          "direction": "ltr",
          "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": message.title,
                "margin": "none",
                "size": "lg",
                "align": "start",
                "weight": "bold",
                "color": "#272727",
                "wrap": true
              }
            ]
          },
          "hero": {
            "type": "image",
            "url": `${config.url}${message.photos[0]}`,
            "margin": "none",
            "align": "center",
            "size": "full",
            "aspectRatio": "4:3",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "label": "Preview image",
              "uri": `${config.url}${message.photos[0]}`
            }
          },
          "body": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": message.body,
                "wrap": true,
              }
            ]
          },
          "styles": {
            "body": {
              "backgroundColor": "#FFFFFF"
            }
          }
        }
      }

      let location = {
        "type": "location",
        "title": message.place || message.title,
        "address": message.address,
        "latitude": Number(message.latitude),
        "longitude": Number(message.longitude)
      }

      bot.push(usersId, [broadcastMessage, location])

    })
    .catch(err => console.log(err))

})

router.get('/', (req, res) => {
  Broadcast.find()
    .then(broadcasts => res.status(200).json(broadcasts))
    .catch(err => console.log(err))
})

module.exports = router