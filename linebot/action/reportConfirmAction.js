module.exports = (label, id) => ({
  "type": "bubble",
  "direction": "ltr",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": label,
        "size": "xl",
        "align": "start",
        "wrap": true
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "button",
        "action": {
          "type": "postback",
          "label": "Ya, benar terjadi",
          "data": `{
            "action": "valid",
            "reportId": ${id}
          }`
        },
        "margin": "none",
        "style": "primary"
      },
      {
        "type": "button",
        "action": {
          "type": "postback",
          "label": "Tidak",
          "text": "Tidak",
          "data": `{
            "action": "invalid",
            "reportId": ${id}
          }`
        },
        "margin": "md",
        "style": "secondary"
      }
    ]
  }
})