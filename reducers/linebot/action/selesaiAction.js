module.exports = (label, id) => ({

  "type": "action",
  "action": {
    "type": "postback",
    "label": label,
    "text": label,
    "data":`{
      "action": "reportDone",
      "reportId": "${id}"
    }`,
  }

})