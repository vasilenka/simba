const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
  status: {
    type: String,
    enum: [
      'active',
      'done',
      'invalid',
    ],
    default: 'active',
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: null,
  }
})

module.exports = mongoose.model('Report', reportSchema)