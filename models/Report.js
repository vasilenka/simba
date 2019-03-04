const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const timestamps = require('mongoose-timestamp')

const reportSchema = new mongoose.Schema({
  reporter: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  address: {
    type: String,
    default: null,
  },
  longitude: {
    type: String,
    default: null,
  },
  latitude: {
    type: String,
    default: null,
  },
  photos: [{
    type: String,
  }],
  keterangan: [{
    type: String,
  }],
  dispatcher: {
    type: ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: [
      'active',
      'done',
      'invalid',
      'cancelled',
      'mission',
      'accomplished',
    ],
    default: 'active',
    lowercase: true,
  }
})

reportSchema.plugin(timestamps)
module.exports = mongoose.model('Report', reportSchema)