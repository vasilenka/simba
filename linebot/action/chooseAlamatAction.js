const config = require('../../config')

module.exports = (id) => ({
  "type": "action",
  // "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type": "postback",
    "text": "chooseAlamat",
    "label": "Alamat",
    "data": `{
      "action": "chooseAlamat",
      "userId": "${id}"
    }`,
  }
})