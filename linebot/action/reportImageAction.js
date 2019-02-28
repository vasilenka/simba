module.exports = url => ({
  "type": "bubble",
  "direction": "ltr",
  "hero": {
    "type": "image",
    "url": url,
    "gravity": "center",
    "size": "full",
    "aspectRatio": "1:1",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": url
    }
  }
})