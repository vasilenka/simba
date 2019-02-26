switch (key) {

  case 'Location':
    event.reply({
      type: 'location',
      title: 'Meridian.id',
      address: 'Komplek Ardhini, Jalan Cipaheut No.6 Cigadung Raya Barat, Cibeunying Kaler, Bandung 40191',
      latitude: -6.8711994,
      longitude: 107.6232741
    })
    break

  case 'Push':
    bot.push('U17448c796a01b715d293c34810985a4c', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)])
    break

  case 'Push2':
    bot.push('Cba71ba25dafbd6a1472c655fe22979e2', 'Push to group')
    break

  case 'Multicast':
    bot.push(['U17448c796a01b715d293c34810985a4c', 'Cba71ba25dafbd6a1472c655fe22979e2'], 'Multicast!')
    break

  case 'Multiple':
    event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'])
    break

  case 'Version':
    event.reply('linebot@' + require('./package.json').version)
    break

  case 'Confirm':
    event.reply({
      type: 'template',
      altText: 'this is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [{
          type: 'message',
          label: 'Yes',
          text: 'yes'
        }, {
          type: 'message',
          label: 'No',
          text: 'no'
        }]
      }
    })
    break

}