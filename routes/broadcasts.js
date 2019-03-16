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

  console.log('REQ: ', req.body)
  console.log('FILES', req.files)

  let users = await User.find()
  let usersId = await users.map(user => user.lineId)

  let body = pick(req.body, ["title", "body"])
  let photos = req.files[0].filename

  let broadcast = new Broadcast({
    title: body.title,
    body: body.body,
    photos: `/images/broadcasts/${photos}`
  })

  res.status(200).send()

  return broadcast.save()
    .then(message => {

      console.log("URL: ", `${config.url}${message.photos[0]}`)

      let image = {
        "type": "image",
        "originalContentUrl": `${config.url}${message.photos[0]}`,
        "previewImageUrl": `${config.url}${message.photos[0]}`,
        "animated": false
      }

      bot.push(usersId, [message.title, image, message.body])

    })
    .catch(err => console.log(err))

})

router.get('/', (req, res) => {
  Broadcast.find()
    .then(broadcasts => res.status(200).json(broadcasts))
    .catch(err => console.log(err))
})

module.exports = router