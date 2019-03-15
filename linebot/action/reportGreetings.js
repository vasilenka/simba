const config = require('./../../config')

module.exports = () => ({
  "type": "flex",
  "altText": "Lapor kebakaran",
  "contents": {
    "type": "bubble",
    "direction": "ltr",
    "header": {
      "type": "box",
      "layout": "vertical",
      "flex": 0,
      "spacing": "none",
      "margin": "none",
      "contents": [
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "spacer",
              "size": "xs"
            }
          ]
        }
      ]
    },
    "hero": {
      "type": "image",
      "url": `${config.url}/images/icons/lapor.png`,
      "margin": "default",
      "align": "center",
      "gravity": "center",
      "size": "full",
      "aspectRatio": "16:9",
      "aspectMode": "fit",
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "spacer",
              "size": "xs"
            }
          ]
        }
      ]
    },
    "styles": {
      "hero": {
        "backgroundColor": "#008384"
      },
      "body": {
        "backgroundColor": "#008384"
      },
      "header": {
        "backgroundColor": "#008384"
      }
    }
  }
})