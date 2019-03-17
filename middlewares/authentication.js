const jwt = require('jsonwebtoken')
const User = require('./../models/User')

module.exports = async (req, res, next) => {
  try {

    let token = req.header('Authorization').replace('Bearer ', '')
    let decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    let user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if(!user) {
      throw new Error()
    }

    req.token = token
    req.user = user
    next()

  } catch (err) {
    res.status(401).send({error: 'Please authenticate'})
  }
}