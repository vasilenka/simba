const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const bot = require('./services/linebot')
const linebotParser = bot.parser()

const app = express()

// Linebot
app.post('/linewebhook', linebotParser)
require('./linebot/__index')(bot)

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
