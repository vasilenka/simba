const config = require('../../config')

module.exports = (id) => ({
  "type": "action",
  // "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type": "postback",
    "text": "gender:choose",
    "label": "Jenis kelamin",
    "data": `{
      "action": "chooseGender",
      "userId": "${id}"
    }`,
  }
})