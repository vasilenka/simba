const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const pick = require('lodash.pick')

const bot = require('./../services/linebot')

const User = require('./../models/User')

router.get('/', (req, res) => {

  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})

router.get('/:id', (req, res) => {

  let id = req.params.id

  User.findById(id)
    .then(user => {
      if(!user) {
        return res.status(404).send()
      }
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})

router.patch('/:id', async (req, res) => {

  let id = req.params.id
  console.log(req.body)
  let body = pick(req.body, ['requestRole', 'role'])

  if(!ObjectId.isValid(id)) {
    return res.status(400).send();
  }

  let user
  try {
    user = await User.findById(id)
  } catch (err) {
    user = null
  }

  if(!user) {
    return res.status(404).json()
  }

  // console.log('REQUEST_ROLE: ', body.requestRole)

  if(body.requestRole.role !== user.role) {
    if(body.requestRole.status === 'accepted') {
      user.role = body.requestRole.role
      user.requestRole = {role: null, status: null}
      bot.push(user.lineId, [`Selamat, kamu sekarang seorang ${user.role}`])
    } else if(body.requestRole.status === 'declined') {
      user.role = body.requestRole.role
      user.requestRole = {role: null, status: null}
      bot.push(user.lineId, [`Permintaan kamu untuk menjadi seorang ${user.role} ditolak oleh admin`])
    }
  } else {
    if(body.role !== user.role) {
      user.role = body.role
      bot.push(user.lineId, [`Kamu ditunjuk admin sebagai seorang ${user.role}`])
    }
  }

  let updatedUser = await user.save()
  if(!updatedUser) {
    return res.status(500).send()
  }

  res.status(200).json(updatedUser)

})

module.exports = router
