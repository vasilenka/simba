const config = require('./../../config')

module.exports = (label, id) =>({
  "type": "action",
  "imageUrl": `${config.url}/images/icons/cross.png`,
  "action": {
    "type": "postback",
    "label": label,
    "text": label,
    "data":`{
      "action": "reportCancel",
      "reportId": "${id}"
    }`,
  }
})