module.exports = event => {
  switch (event.postback.data) {
    case 'location':
      event.reply()
      break;

    case 'photo':
      event.reply()
      break;

    default:
      break;
  }
}