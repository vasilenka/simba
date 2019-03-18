const jwt = require('jsonwebtoken')
const User = require('./../models/User')

module.exports = async (req, res, next) => {

    let token = req.header('Authorization').replace('Bearer ', '')
    let decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    let user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if(!user) {
      return res.status(401).json({error: 'Please authenticate'})
    }

    req.token = token
    req.user = user
    next()

}