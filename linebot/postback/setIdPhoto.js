const messageTemplate = require('./../action/reportStillPending')
const cameraAction = require('../action/cameraAction')
const cameraRollAction = require('../action/cameraRollAction')

module.exports = async (data, event, bot) => {

  let reply = messageTemplate('Pilih salah satu tombol dibawah ini untuk mengupload foto KTP-mu')
  reply.quickReply.items.push(cameraAction('Ambil foto KTP'))
  reply.quickReply.items.push(cameraRollAction())

  let idSample = {
    type: 'image',
    originalContentUrl: "https://www.batamnews.co.id/foto_berita/73ktp-penipuan.jpg",
    previewImageUrl: "https://www.batamnews.co.id/foto_berita/73ktp-penipuan.jpg",
  };

  return event.reply(["Silahkan kirim foto KTP terbaru dengan posisi foto horizontal/landscape seperti contoh berikut", idSample, reply])

}