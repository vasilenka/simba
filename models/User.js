const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('./../config')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lineId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    minlength: 6
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
  profileUrl: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
})

userSchema.methods.toJSON = function () {

  let user = this
  let userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject

}

userSchema.methods.getPublicProfile = function() {

  let user = this
  let userObject = user.toObject()

  // delete userObject.email
  delete userObject.password
  delete userObject.tokens
  delete userObject.address
  delete userObject.idUrl
  delete userObject.longitude
  delete userObject.latitude
  delete userObject.gender
  delete userObject.birthDate

  return userObject

}

userSchema.methods.generateAuthToken = async function() {

  let user = this
  let token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_TOKEN)
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token

}

userSchema.statics.findByCredential = async (email, password) => {

  let user = await User.findOne({ email })
  if(!user) {
    throw new Error('Unable to login')
  }

  let isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    throw new Error('Unable to login')
  }
  return user

}

userSchema.pre('save', async function(next) {

  let user = this
  if(user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()

})

// TODO: MUST CHECK TIME CREATED ON REGISTERED ACCOUNT

userSchema.plugin(timestamps)
const User = mongoose.model('User', userSchema)
module.exports = User