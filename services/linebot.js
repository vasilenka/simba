const linebot = require('linebot')

const config = require('../config')
const bot = linebot(config.bot)

module.exports = bot