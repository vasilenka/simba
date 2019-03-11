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
          "label": "Sudah berhasil diatasi",
          "data": `{
            "action": "valid",
            "reportId": ${id}
          }`
        },
        "margin": "none",
        "style": "primary"
      }
    ]
  }
})