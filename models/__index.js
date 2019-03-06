const mongoose = require('mongoose')
const config = require('./../config/index')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const connection = async () => {
  let connected = false
  let maxReconnect = 10
  let mongoUrl
  if(process.env.NODE_ENV === 'production') {
    mongoUrl = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`
  } else {
    mongoUrl = config.database
  }

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
      console.log(`Reconnecting to ${mongoUrl} in 2 seconds...`)
      console.log('======================================')
      await sleep(2000)
      maxReconnect -= 1
    }
  }

  mongoose.Promise = global.Promise
}

module.exports = connection