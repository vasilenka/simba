const jwt = require('jsonwebtoken')
const User = require('./../models/User')

module.exports = async (req, res, next) => {

  console.log('VERIFYING...')
  let token = req.header('Authorization').replace('Bearer ', '')
  console.log('TOKEN: ', token)

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    console.log('DECODED: ', decoded)
  } catch (err) {
    return res.status(403).json({error: 'Token not valid'})
  }

  let user = await User.findById({_id: decoded._id})
  console.log('USER: ', user)

  if(!user) {
    return res.status(401).json({error: 'Please authenticate'})
  }

  req.token = token
  req.user = user
  next()

}