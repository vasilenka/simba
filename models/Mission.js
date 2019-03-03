const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const timestamps = require('mongoose-timestamp')

const missionSchema = new mongoose.Schema({
  report: {
    type: ObjectId,
    required: true,
    ref: 'Report',
  },
  dispathcer: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: [
      'active',
      'accomplished',
    ],
    default: 'active',
    lowercase: true,
  }
})

missionSchema.plugin(timestamps)
module.exports = mongoose.model('Mission', missionSchema)