module.exports = id => ({
  "type": "bubble",
  "direction": "ltr",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Pilih jenis kelaminmu",
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
          "label": "Laki-laki",
          "text": "gender:laki-laki",
          "data": `{
            "action": "male",
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
          "label": "Perempuan",
          "text": "gender:perempuan",
          "data": `{
            "action": "female",
            "reportId": ${id}
          }`
        },
        "margin": "md",
        "style": "secondary"
      }
    ]
  }
})