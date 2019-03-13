const config = require('./../../config')

module.exports = id => ({
  "type": "action",
  // "imageUrl": `${config.url}/images/icons/check.png`,
  "action": {
    "type":"datetimepicker",
    "label": "Tanggal lahir",
    "data": `{
      "action": "setBirthDate",
      "userId": "${id}"
    }`,
    "mode": "date",
    "initial": "1993-12-02",
    "max": "2018-12-31",
    "min": "1920-12-31",
  }
})