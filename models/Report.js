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
  processedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: [
      'pending',
      'active',
      'invalid',
      'cancelled',
      'mission',
      'accomplished',
    ],
    default: 'pending',
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

// reportSchema.methods.getPublicProfile = function() {
//   let report = this

//   if(report.reporter) {

//   }

// }

reportSchema.plugin(timestamps)
const Report = mongoose.model('Report', reportSchema)

module.exports = Report