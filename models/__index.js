const mongoose = require('mongoose')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const connectToMongo = async () => {
  let connected = false
  let maxReconnect = 10
  let mongoUrl = process.env.MONGODB_URL
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)

  while (!connected && maxReconnect) {
    try {
      let mongo = await mongoose.connect(
        mongoUrl,
        {
          useNewUrlParser: true,
          reconnectTries: 10,
          reconnectInterval: 500,
          connectTimeoutMS: 10000
        }
      )
      if (mongo) {
        console.log('======================================')
        console.log('MONGODB CONNECTED....')
        console.log('======================================')
        connected = true
      } else {
      }
    } catch (err) {
      console.log('======================================')
      console.log('Reconnecting to database in 2 seconds...')
      console.log('======================================')
      await sleep(2000)
      maxReconnect -= 1
    }
  }

  mongoose.Promise = global.Promise
}

module.exports = connectToMongo