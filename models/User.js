const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    default: null,
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
    default: null,
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
    default: 'pending',
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
  },
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

// TODO: MUST CHECK TIME CREATED ON REGISTERED ACCOUNT

userSchema.plugin(timestamps)
module.exports = mongoose.model('User', userSchema);