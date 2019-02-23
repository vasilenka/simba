const User = require('../models/User')

module.exports = (req, res, next) => {

  User.findOne({lineId: req.body.user.lineId})
    .then(user => {

      if(user) {
        req.body.userId = user._id
        return next()
      }

      let newUser = new User({
        name: req.body.user.name,
        lineId: req.body.user.lineId,
      })

      newUser.save()
        .then(user => {
          req.body.userId = user._id
          next()
        })
        .catch(err => Promise.reject(err))

    })
    .catch(err => console.log(err))

}