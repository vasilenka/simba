const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Report = require('./../models/Report')

const validateReporter = require('../middlewares/validateReporter')

router.get('/', (req, res) => {

  Report.find()
    .sort({ createdAt: -1 })
    .populate('reporter')
    .then(reports => res.status(200).send(reports))
    .catch(err => console.log(err))

})

router.get('/one', (req, res) => {

  Report.findOne()
    .populate('reporter')
    .then(report => res.status(200).send(report))
    .catch(err => console.log(err))

})

router.get('/:id', (req, res) => {

  let id = req.params.id

  Report.findById(id)
    .populate('reporter')
    .then(report => res.status(200).send(report))
    .catch(err => console.log(err))

})

router.post('/', validateReporter, (req, res) => {

  let { title, userId } = req.body

  let report = new Report({
    title,
    reporter: userId
  })

  report.save(report)
    .then(report => res.status(200).json(report))
    .catch(err => console.log(err))

})

module.exports = router
