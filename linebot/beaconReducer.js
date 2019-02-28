module.exports = event => {
  event.reply('beacon: ' + event.beacon.hwid)
}