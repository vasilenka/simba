module.exports = (label, id) =>({
  "type": "action",
  "imageUrl": "https://32a5f7ba.ngrok.io/images/icons/cross.png",
  "action": {
    "type": "postback",
    "label": label,
    "text": label,
    "data":`{
      "action": "reportCancel",
      "reportId": "${id}"
    }`,
  }
})