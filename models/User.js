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
  }
})

userSchema.plugin(timestamps)
module.exports = mongoose.model('User', userSchema);