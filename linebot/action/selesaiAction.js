const config = require('./../../config')

module.exports = (label, id) => ({

  "type": "action",
  "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type": "postback",
    "label": label,
    "text": label,
    "data":`{
      "action": "reportDone",
      "reportId": "${id}"
    }`,
  }

})