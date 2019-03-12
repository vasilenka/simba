const config = require('../../config')

module.exports = (id) => ({
  "type": "action",
  "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type": "postback",
    "text": "chooseGender",
    "label": "Jenis kelamin",
    "data": `{
      "action": "chooseGender",
      "userId": "${id}"
    }`,
  }
})