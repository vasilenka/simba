module.exports = (text, format) => ({
  "type": "flex",
  "altText": "message format",
  "contents": {
    "type": "bubble",
    "direction": "ltr",
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "none",
      "margin": "none",
      "contents": [
        {
          "type": "text",
          "text": text,
          "size": "sm",
          "align": "start",
          "wrap": true
        },
        {
          "type": "separator",
          "margin": "sm",
          "color": "#FFFFFF"
        },
        {
          "type": "text",
          "text": format,
          "margin": "md",
          "size": "md",
          "weight": "bold",
          "wrap": true
        }
      ]
    }
  }
})