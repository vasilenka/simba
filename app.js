const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const bot = require('./services/linebot')
const linebotParser = bot.parser()

const app = express()

// Linebot
app.post('/linewebhook', linebotParser)
require('./linebot/__index')(bot)

// Force HTTPS on production
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    let protocol = req.get('x-forwarded-proto')
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url)
  })
}

const corsOptions = {
  credentials: true
}

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', require('./routes/auth'))
require('./routes/__index')(app)

module.exports = app
