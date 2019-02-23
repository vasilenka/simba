const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  valid: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  lineId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      'admin',
      'dispatcher',
      'fireman',
      'volunteer',
      'reporter',
    ],
    default: 'reporter',
    lowercase: true,
  }
})

userSchema.plugin(timestamps)
module.exports = mongoose.model('User', userSchema);