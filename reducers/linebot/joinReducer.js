module.exports = event => {
  event.reply('join: ' + event.source.groupId)
}