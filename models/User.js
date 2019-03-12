const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: [
      null,
      'male',
      'female',
    ],
    default: null,
  },
  idUrl: {
    type: String,
    default: null,
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
  requestRole: {
    role: {
      type: String,
      enum: [
        null,
        'admin',
        'dispatcher',
        'fireman',
        'volunteer',
      ],
      default: null,
      lowercase: true,
    },
    status: {
      type: String,
      enum: [
        null,
        'pending',
        'accepted',
        'declined',
      ],
      default: null,
      lowercase: true,
    }
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
  },
  registerProcess: {
    type: String,
    enum: [
      null,
      'pending',
      'done',
    ],
    default: null,
    lowercase: true,
  },
  status: {
    type: String,
    enum: [
      null,
      'pending',
      'invalid',
      'valid',
    ],
    default: null,
    lowercase: true,
  }
})

userSchema.plugin(timestamps)
module.exports = mongoose.model('User', userSchema);