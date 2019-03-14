const client = require('socket.io-client')
const config = require('./../config')

module.exports = client(config.url)