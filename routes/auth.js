const express = require('express')
const router = express.Router()

const config = require('../config')

const User = require('../models/User')

const io = require('../services/socketClient')
const bot = require('../services/linebot')

const auth = require('./../middlewares/authentication')
const verifyResetToken = require('./../middlewares/verifyResetToken')

router.get('/', async (req, res) => {
  try {
    let user = await User.findByCredential(req.body.email, req.body.password)
    let token = await user.generateAuthToken()
    res.status(200).json({user, token})
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.post('/me', auth, async (req, res) => {
  let user = req.user
  let token = req.token
  if(!user) {
    res.status(400).send()
  }
  return res.status(200).json({user, token})
})

router.post('/logout', auth, async (req, res) => {
  try {
    let user = req.user
    user.tokens = user.tokens.filter(token => token.token !== req.token)
    let updatedUser = await user.save()
    res.status(200).send(updatedUser)
  } catch (err) {
    res.status(500).send()
  }
})

router.post('/verifyMe', verifyResetToken, async (req, res) => {
  let user = req.user
  res.status(200).json(user)
})

router.post('/', async (req, res) => {
  let id = req.body.id

  try {
    let user = await User.findById(id)
    user.email = email
    user.password = password
    let token = await user.generateAuthToken()
    user.save()
      .then(usr => res.status(200).json({usr, token}))
      .catch(err => {
        console.log(err)
        return res.status(500).json()
      })
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

module.exports = router