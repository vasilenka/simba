const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

  let id = req.params.id
  let token = jwt.sign({ _id: id }, process.env.SECRET_TOKEN)

  req.token = token
  next()

}