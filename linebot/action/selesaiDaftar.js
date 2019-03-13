const config = require('./../../config')

module.exports = (label, id) => ({
  "type": "action",
  "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type": "postback",
    "label": label,
    "text": "daftar:selesai",
    "data":`{
      "action": "registerDone",
      "userId": "${id}"
    }`,
  }
})