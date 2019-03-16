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

const headerAction = require('../linebot/action/reportHeaderAction')
const confirmAction = require('../linebot/action/missionCompleted')
const imageAction = require('../linebot/action/reportImageAction')

router.post('/line', async (req, res) => {

  console.log("REQUEST", req)
  res.status(200).json({
    success: true
  })

})

router.get('/line', async (req, res) => {

  console.log("REQUEST", req)
  res.status(200).json({
    success: true
  })

})

router.get('/line/callback', async (req, res) => {

  console.log("REQUEST", req)
  res.status(200).json({
    callback: true
  })

})

router.post('/line/callback', async (req, res) => {

  console.log("REQUEST", req)
  res.status(200).json({
    callback: true
  })

})

module.exports = router