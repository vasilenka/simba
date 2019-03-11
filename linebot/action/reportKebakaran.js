const config = require('./../../config')

module.exports = () => ({
  "type": "flex",
  "altText": "Flex Message",
  "contents": {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "flex": 0,
      "contents": [
        {
          "type": "filler"
        }
      ]
    },
    "hero": {
      "type": "image",
      "url": `${config.url}/images/icons/lapor.png`,
      "size": "full",
      "aspectRatio": "3:1",
      "aspectMode": "fit",
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "none",
      "margin": "none",
      "contents": [
        {
          "type": "text",
          "text": "Lengkapi data berikut untuk membuat laporan baru",
          "margin": "md",
          "wrap": true
        }
      ]
    },
    "styles": {
      "body": {
        "backgroundColor": "#FFFFFF"
      }
    }
  },
  "quickReply": {
    "items": []
  }
})