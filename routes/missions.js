const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Mission = require('./../models/Mission')

router.get('/', (req, res) => {

  Mission.find()
    .sort({ createdAt: -1 })
    .populate('report')
    .populate('reporter')
    .populate('dispatcher')
    .then(missions => res.status(200).send(missions))
    .catch(err => console.log(err))

})

router.post('/', (req, res) => {

  Mission.find()
    .sort({ createdAt: -1 })
    .populate('report')
    .populate('reporter')
    .populate('dispatcher')
    .then(missions => res.status(200).send(missions))
    .catch(err => console.log(err))

})

module.exports = router