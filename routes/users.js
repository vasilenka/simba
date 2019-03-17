const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const dayjs = require('dayjs')
const ObjectId = mongoose.Types.ObjectId

const pick = require('lodash.pick')

const bot = require('./../services/linebot')

const User = require('./../models/User')
const Report = require('./../models/Report')

router.get('/', (req, res) => {

  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})

router.get('/reports/:id', (req, res) => {

  let id = req.params.id

  Report.find({reporter: id})
    .populate('reporter')
    .then(reports => res.status(200).json(reports))
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })
})

router.get('/year/:year', (req, res) => {

  let year = req.params.year

  User.find()
    .then(users => res.status(200).json(users.filter(user => dayjs(user.createdAt).year() === Number(year))))
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

  if(body.requestRole.role !== user.role) {
    if(body.requestRole.status === 'accepted') {
      user.role = body.requestRole.role
      user.requestRole = {role: null, status: null}
      bot.push(user.lineId, [`Selamat, kamu sekarang seorang ${user.role}`])
    } else if(body.requestRole.status === 'declined') {
      user.requestRole = {role: null, status: null}
      bot.push(user.lineId, [`Permintaan kamu untuk menjadi seorang ${user.requestRole} ditolak oleh admin`])
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

router.delete('/:id', async (req, res) => {

  let id = req.params.id
  User.deleteOne({ _id: id })
    .then(user => res.status(200).json(user))
    .catch(err => {
      console.log(err)
      return res.status(500).send()
    })

})

module.exports = router
