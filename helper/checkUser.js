const User = require('../models/User')

module.exports = async data => {

  let {userId, displayName, pictureUrl} = data

  return User.findOne({lineId: userId})
    .then(user => {

      if(!user) {
        let newUser = new User({
          name: displayName,
          lineId: userId,
          profileUrl: pictureUrl,
        })

        return newUser.save()
          .then(user => {
            return user
          })
          .catch(err => console.log(err))

      }

      return user

    })
    .catch(err => console.log(err))

}