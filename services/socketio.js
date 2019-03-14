const io = require('socket.io')

const socketIO = server => io(server, {
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  })

module.exports = { socketIO }