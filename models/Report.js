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
  dispatcher: {
    type: ObjectId,
    default: null,
    ref: 'User',
  },
  photos: [{
    type: String,
  }],
  keterangan: [{
    type: String,
  }],
  status: {
    type: String,
    enum: [
      'active',
      'done',
      'invalid',
      'cancelled',
    ],
    default: 'active',
    lowercase: true,
  }
})

reportSchema.plugin(timestamps)
module.exports = mongoose.model('Report', reportSchema)