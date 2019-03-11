module.exports = () => ({
  "type": "flex",
  "altText": "Bantuan",
  "contents": {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "direction": "ltr",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "📣",
              "size": "xxl",
              "align": "start"
            },
            {
              "type": "text",
              "text": "List pesan",
              "size": "xl",
              "align": "start"
            },
            {
              "type": "separator",
              "margin": "lg"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "margin": "lg",
              "contents": [
                {
                  "type": "text",
                  "text": "Lapor",
                  "flex": 0,
                  "align": "start",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "Buat laporan baru",
                  "align": "end",
                  "color": "#767676"
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "margin": "lg",
              "contents": [
                {
                  "type": "text",
                  "text": "Help",
                  "flex": 0,
                  "align": "start",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "Tampilkan bantuan",
                  "align": "end",
                  "color": "#767676"
                }
              ]
            }
          ]
        }
      },
      {
        "type": "bubble",
        "direction": "ltr",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "⏰",
              "size": "xxl",
              "align": "start"
            },
            {
              "type": "text",
              "text": "Batas waktu 5 menit",
              "size": "xl",
              "align": "start"
            },
            {
              "type": "text",
              "text": "Laporan otomatis ditutup jika dalam 5 menit belum ditandai \"selesai\" dan tidak ada update lebih lanjut",
              "size": "md",
              "color": "#767676",
              "wrap": true
            }
          ]
        },
        "styles": {
          "body": {
            "backgroundColor": "#FFF6F6"
          }
        }
      },
      {
        "type": "bubble",
        "direction": "ltr",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "📝",
              "size": "xxl",
              "align": "start"
            },
            {
              "type": "text",
              "text": "Info tambahan",
              "size": "xl",
              "align": "start"
            },
            {
              "type": "text",
              "text": "Tambahkan informasi lebih lanjut mengenai laporanmu dengan mengirimkan pesan berupa teks",
              "size": "md",
              "color": "#767676",
              "wrap": true
            }
          ]
        },
        "styles": {
          "body": {
            "backgroundColor": "#F0FDFD"
          }
        }
      }
    ]
  }
})