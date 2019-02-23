const linebot = require('linebot')

const config = require('../config')
const bot = linebot(config.bot)

const linebotParser = bot.parser()

require('./../reducers/linebot/__index')(bot)

module.exports = linebotParser