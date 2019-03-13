const config = require('../../config')

module.exports = (id) => ({
  "type": "action",
  // "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type": "postback",
    "text": "chooseId",
    "label": "Foto KTP",
    "data": `{
      "action": "chooseId",
      "userId": "${id}"
    }`,
  }
})