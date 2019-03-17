const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const pick = require('lodash.pick')

const config = require('../config')

const Report = require('../models/Report')
const User = require('../models/User')
const Broadcast = require('../models/Broadcast')

const io = require('../services/socketClient')
const bot = require('../services/linebot')

const auth = require('./../middlewares/authentication')

const headerAction = require('../linebot/action/reportHeaderAction')
const confirmAction = require('../linebot/action/missionCompleted')
const imageAction = require('../linebot/action/reportImageAction')

router.post('/', async (req, res) => {
  try {
    let user = await User.findByCredential(req.body.email, req.body.password)
    let token = await user.generateAuthToken()
    res.status(200).json({user, token})
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.post('/logout', auth, async(req, res) => {
  try {
    let user = req.user
    console.log("USER: ", user)
    user.tokens = user.tokens.filter(token => token.token !== req.token)
    let updatedUser = await user.save()
    res.status(200).send(updatedUser)
  } catch (err) {
    res.status(500).send()
  }
})

module.exports = router