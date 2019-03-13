module.exports = text => ({
  "type": "flex",
  "altText": "Daftar akun",
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
          "type": "text",
          "text": "DAFTAR AKUN",
          "margin": "none",
          "size": "sm",
          "align": "center",
          "weight": "bold",
          "color": "#484848"
        }
      ]
    },
    "hero": {
      "type": "image",
      "url": "https://cdn.dribbble.com/users/1418633/screenshots/5106121/hi-dribbble-studiotale.gif",
      "margin": "default",
      "align": "center",
      "gravity": "center",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover",
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
    }
  }
})