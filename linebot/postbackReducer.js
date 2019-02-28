const reportDonePostback = require('./postback/reportDonePostback')
const reportCancelPostback = require('./postback/reportCancelPostback')

module.exports = async (event, bot) => {
  let data = JSON.parse(event.postback.data)

  switch (data.action) {

    case 'reportDone': return reportDonePostback(data, event, bot)
    case 'reportCancel': return reportCancelPostback(data, event, bot)

    default:
      break;
  }
}