module.exports = (title, address, url) => ({
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": title,
        "size": "sm",
        "weight": "bold",
        "color": "#484848"
      }
    ]
  },
  "body": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "md",
    "contents": [
      {
        "type": "text",
        "text": address,
        "size": "xl",
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
          "label": "More",
          "uri": url
        },
        "style": "link",
        "gravity": "center"
      }
    ]
  }
})