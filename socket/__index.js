const client = undefined
const socket = io => {

  io.on('connection', async client => {

    client = client

    console.log('Client connected 👋🏻')

    client.on('disconnecting', reason => {
      console.log('Client disconneting')
    });

    client.on('change_color', (color) => {
      console.log('Color Changed to: ', color)
      client.emit('change_color', color)
    })

    client.on('new_report', (report) => {
      io.emit('new_report', report)
    })

  })

}

module.exports = { socket, client }