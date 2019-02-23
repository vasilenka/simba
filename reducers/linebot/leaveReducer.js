module.exports = event => {
  event.reply('leave: ' + event.source.groupId)
}