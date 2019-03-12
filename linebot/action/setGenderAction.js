module.exports = (title, label, id) => ({
  "type": "template",
  "altText": `${label}`,
  "template": {
    "type": "buttons",
    "actions": [
      {
        "type": "postback",
        "label": "Laki-laki",
        "text": "setgender:laki-laki",
        "data": `{
          "action": "setGender",
          "gender": "male",
          "userId": "${id}"
        }`
      },
      {
        "type": "postback",
        "label": "Perempuan",
        "text": "setgender:perempuan",
        "data": `{
          "action": "setGender",
          "gender": "female",
          "userId": "${id}"
        }`
      }
    ],
    "title": `${title}`,
    "text": `${label}`
  }
})