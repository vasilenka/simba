const reportDonePostback = require('./postback/reportDonePostback')
const reportCancelPostback = require('./postback/reportCancelPostback')
const setGender = require('./postback/setGender')
const chooseGender = require('./postback/chooseGender')
const setBirthDate = require('./postback/setBirthDate')

module.exports = async (event, bot) => {

  let data = JSON.parse(event.postback.data)
  console.log('DATA: ', data)

  switch (data.action) {

    case 'setBirthDate': return setBirthDate(data, event, bot)
    case 'chooseGender': return chooseGender(data, event, bot)
    case 'setGender': return setGender(data, event, bot)
    case 'reportDone': return reportDonePostback(data, event, bot)
    case 'reportCancel': return reportCancelPostback(data, event, bot)

    default:
      break;
  }
}