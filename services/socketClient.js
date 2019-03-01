const client = require('socket.io-client')

module.exports = client('http://localhost:3000', { path: '/live'})