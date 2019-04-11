const dayjs = require('dayjs')
const config = require('./../../../config')

const checkUser = require('./../../../helper/checkUser')
const validateUser = require('./../../../helper/validateUser')

const User = require('./../../../models/User')
const io = require('./../../../services/socketClient')

const imageAction = require('./../../action/reportImageAction')
const headerAction = require('./../../action/reportHeaderAction')

function capitalizeFirstLetter(string) {
  return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
}

module.exports = async (event, bot) => {
  event.source.profile()
    .then(async incomingUser => {

      let user = await checkUser(incomingUser)
      let admin = await User.find({role: 'dispatcher'})
      let adminId = await admin.map(admin => admin.lineId)
      let validUser = validateUser(user, event, bot)

      if(user && validUser) {

        if(user.role !== 'dispatcher') {

          user.requestRole.role = 'dispatcher'
          user.requestRole.status = 'pending'

          let updatedUser = await user.save()

          if(updatedUser) {

            let userUrl = `${config.webUrl}/users/${updatedUser._id}`

            let carousel = {
              "type": "flex",
              "altText": "DISPATCHER REQUEST",
              "contents": {
                "type": "carousel",
                "contents": []
              }
            }

            let headerMessage = {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "spacing": "none",
                "margin": "none",
                "contents": [
                  {
                    "type": "text",
                    "text": "DISPATCHER REQUEST",
                    "margin": "none",
                    "size": "sm",
                    "gravity": "top",
                    "weight": "bold",
                    "color": "#484848"
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "none",
                "margin": "none",
                "contents": [
                  {
                    "type": "text",
                    "text": capitalizeFirstLetter(updatedUser.fullName),
                    "size": "md",
                    "align": "start",
                    "margin": "lg",
                    "weight": "bold",
                    "color": "#282828",
                    "wrap": true
                  },
                  {
                    "type": "separator",
                    "margin": "md"
                  },
                  {
                    "type": "text",
                    "text": capitalizeFirstLetter(updatedUser.gender),
                    "size": "md",
                    "align": "start",
                    "margin": "md",
                    "color": "#484848",
                    "wrap": true
                  },
                  {
                    "type": "separator",
                    "margin": "md"
                  },
                  {
                    "type": "text",
                    "text": dayjs(updatedUser.birthDate).format("DD MMMM YYYY"),
                    "size": "md",
                    "align": "start",
                    "margin": "md",
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
                      "label": "Detail user",
                      "uri": userUrl
                    },
                    "style": "link",
                    "gravity": "center"
                  }
                ]
              }
            }

            let addressMessage = {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "spacing": "none",
                "margin": "none",
                "contents": [
                  {
                    "type": "text",
                    "text": "Alamat",
                    "margin": "none",
                    "size": "sm",
                    "gravity": "top",
                    "weight": "bold",
                    "color": "#484848"
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "none",
                "margin": "none",
                "contents": [
                  {
                    "type": "text",
                    "text": capitalizeFirstLetter(updatedUser.address),
                    "size": "lg",
                    "align": "start",
                    "margin": "lg",
                    "color": "#282828",
                    "wrap": true
                  }
                ]
              }
            }

            let confirmMessage = {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Konfirmasi permintaan user untuk menjadi dispatcher",
                    "size": "xl",
                    "align": "start",
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
                      "type": "postback",
                      "label": "TERIMA",
                      "text": "approve:dispatcher",
                      "data": `{
                        "action": "approveDispatcher",
                        "userId": "${updatedUser._id}"
                      }`
                    },
                    "margin": "none",
                    "style": "primary"
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "postback",
                      "label": "TOLAK",
                      "text": "deny:dispatcher",
                      "data": `{
                        "action": "denyDispatcher",
                        "userId": "${updatedUser._id}"
                      }`
                    },
                    "margin": "md",
                    "style": "secondary"
                  }
                ]
              }
            }

            carousel.contents.contents.push(headerMessage)
            carousel.contents.contents.push(addressMessage)

            let photosUrl = updatedUser.profileUrl
            let idUrl = `${config.url}${updatedUser.idUrl}`
            carousel.contents.contents.push(imageAction(photosUrl))
            carousel.contents.contents.push(imageAction(idUrl))

            carousel.contents.contents.push(confirmMessage)

            io.emit('new_request', updatedUser)
            bot.push(adminId, [carousel])
            return event.reply(["Permintaanmu akan segera kami proses"])

          } else {

            return event.reply(['Maaf sedang ada gangguan, silahkan ulangi perintah anda'])

          }
        } else {

          event.reply(["Haloo, admin 👋🏻"])

        }

      }
    })
    .catch(err => {
      console.log(err)
      return event.reply(['Maaf, sedang ada gangguan', 'Silahkan ulangi pesanmu'])
    })
}