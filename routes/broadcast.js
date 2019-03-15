const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const pick = require('lodash.pick')
const multer = require('multer')

const config = require('./../config')

const Report = require('./../models/Report')
const User = require('./../models/User')
const Broadcast = require('./../models/Broadcast')

const io = require('./../services/socketClient')
const bot = require('./../services/linebot')

const headerAction = require('./../linebot/action/reportHeaderAction')
const confirmAction = require('./../linebot/action/missionCompleted')
const imageAction = require('./../linebot/action/reportImageAction')

router.post('/', async (req, res) => {

  let users = await User.find()
  let usersId = await users.map(user => user.lineId)

  let body = pick(req.body, ["title", "body"])

  let broadcast = new Broadcast({
    title: body.title,
    body: body.body
  })

  return broadcast.save()
    .then(message => {
      bot.push(usersId, [message.title, message.body])
        .then(msg => res.status(200).json(msg))
    })
    .catch(err => console.log(err))

})

module.exports = router