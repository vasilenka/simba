const mongoose = require('mongoose')
// const ObjectId = mongoose.Schema.Types.ObjectId
const timestamps = require('mongoose-timestamp')

const broadcastSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null,
    required: true,
  },
  body: {
    type: String,
    default: null,
  },
  photos: [{
    type: String,
  }],
  yearCreated: {
    type: Number,
    default: new Date(Date.now()).getFullYear()
  },
  monthCreated: {
    type: Number,
    default: new Date(Date.now()).getMonth()
  },
  dayCreated: {
    type: Number,
    default: new Date(Date.now()).getDate()
  }
})

broadcastSchema.plugin(timestamps)
module.exports = mongoose.model('Broadcast', broadcastSchema)