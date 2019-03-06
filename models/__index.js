const mongoose  = require('mongoose')
const config = require('../config')

mongoose.connect( config.database, { useNewUrlParser: true })

const mongo = mongoose.connection
mongo.on('error', console.error.bind(console, 'connection error:'))
mongo.once('open', () => {
  console.log('Database connected...')
})

module.exports = mongo