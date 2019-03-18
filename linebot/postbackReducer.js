const reportDonePostback = require('./postback/reportDonePostback')
const reportCancelPostback = require('./postback/reportCancelPostback')
const setGender = require('./postback/setGender')
const chooseGender = require('./postback/chooseGender')
const setBirthDate = require('./postback/setBirthDate')
const setIdPhoto = require('./postback/setIdPhoto')

const setRegisterDone = require('./postback/setRegisterDone')
const chooseAlamat = require('./postback/chooseAlamat')

const approveDispatcher = require('./postback/approveDispatcher')
const denyDispatcher = require('./postback/denyDispatcher')

module.exports = async (event, bot) => {

  let data = JSON.parse(event.postback.data)
  console.log('DATA: ', data)

  switch (data.action) {

    case 'setBirthDate': return setBirthDate(data, event, bot)
    case 'setGender': return setGender(data, event, bot)
    case 'chooseGender': return chooseGender(data, event, bot)
    case 'chooseAlamat': return chooseAlamat(data, event, bot)
    case 'chooseId': return setIdPhoto(data, event, bot)
    case 'registerDone': return setRegisterDone(data, event, bot)

    case 'approveDispatcher': return approveDispatcher(data, event, bot)
    case 'denyDispatcher': return denyDispatcher(data, event, bot)

    case 'reportDone': return reportDonePostback(data, event, bot)
    case 'reportCancel': return reportCancelPostback(data, event, bot)

    default:
      break;
  }
}