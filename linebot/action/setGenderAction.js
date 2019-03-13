module.exports = (id) => ({
  "type": "template",
  "altText": "Pilih jenis kelamin",
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
    "title": "Jenis kelamin",
    "text": "Silahkan pilih jenis kelamin anda"
  }
})

// {
//   "type": "flex",
//   "altText": "Flex Message",
//   "contents": {
//     "type": "bubble",
//     "header": {
//       "type": "box",
//       "layout": "vertical",
//       "flex": 0,
//       "contents": [
//         {
//           "type": "text",
//           "text": "Pilih jenis kelamin anda",
//           "size": "lg"
//         }
//       ]
//     },
//     "body": {
//       "type": "box",
//       "layout": "vertical",
//       "spacing": "md",
//       "contents": [
//         {
//           "type": "button",
//           "action": {
//             "type": "postback",
//             "label": "Laki-laki",
//             "text": "setgender:laki-laki",
//             "data": `{
//               "action": "setGender",
//               "gender": "male",
//               "userId": "${id}"
//             }`
//           },
//           "color": "#008384",
//           "style": "primary"
//         },
//         {
//           "type": "button",
//           "action": {
//             "type": "postback",
//             "label": "Perempuan",
//             "text": "setgender:perempuan",
//             "data": `{
//               "action": "setGender",
//               "gender": "female",
//               "userId": "${id}"
//             }`
//           },
//           "color": "#FF5A5B",
//           "style": "primary"
//         }
//       ]
//     }
//   }
// }