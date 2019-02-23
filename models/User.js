const mongoose = require('mongoose')

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

module.exports = mongoose.model('User', userSchema);