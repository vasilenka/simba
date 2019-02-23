const dayjs = require('dayjs')

module.exports = lastUpdate => {

  let now = dayjs(Date.now())
  let limit = dayjs(lastUpdate).add(10, 'minute')

  return now.isAfter(limit)

}