module.exports = event => {
  event.reply({
    "type": "text",
    "text": "Select your favorite food category or send me your location!",
    "quickReply": {
      "items": [
        {
          "type": "action",
          "action": {
            "type": "location",
            "label": "Send location"
          }
        }
      ]
    }
  })
}