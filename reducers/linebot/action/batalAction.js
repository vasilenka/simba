module.exports = (label, id) =>({
  "type": "action",
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