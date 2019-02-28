module.exports = (title, address, url) => ({
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "none",
    "margin": "none",
    "contents": [
      {
        "type": "text",
        "text": title,
        "margin": "none",
        "size": "md",
        "gravity": "top",
        "weight": "bold",
        "color": "#484848"
      }
    ]
  },
  "body": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "none",
    "margin": "none",
    "contents": [
      {
        "type": "text",
        "text": address,
        "size": "lg",
        "align": "start",
        "color": "#484848",
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
          "type": "uri",
          "label": "Detail laporan",
          "uri": url
        },
        "style": "link",
        "gravity": "center"
      }
    ]
  }
})