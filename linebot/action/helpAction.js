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
            // {
            //   "type": "text",
            //   "text": "📣",
            //   "size": "xxl",
            //   "align": "start"
            // },
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
              "layout": "vertical",
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
                  "align": "start",
                  "size": "sm",
                  "wrap": true,
                  "color": "#767676"
                }
              ]
            },
            {
              "type": "separator",
              "margin": "lg"
            },
            {
              "type": "box",
              "layout": "vertical",
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
                  "text": "Menampilkan menu bantuan",
                  "align": "start",
                  "size": "sm",
                  "wrap": true,
                  "color": "#767676"
                }
              ]
            },
            {
              "type": "separator",
              "margin": "lg"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "contents": [
                {
                  "type": "text",
                  "text": "/feedback[spasi]isi_pesan",
                  "flex": 0,
                  "align": "start",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "Beri masukkan, request fitur, kritik & saran mengenai layanan darurat!",
                  "align": "start",
                  "size": "sm",
                  "color": "#767676",
                  "wrap": true
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
              "margin": "lg",
              "type": "text",
              "text": "Batas waktu 5 menit",
              "size": "xl",
              "align": "start",
              "color": "#ffffff",
              "weight": "bold"
            },
            {
              "type": "separator",
              "margin": "lg",
              "color": "#ff8181",
            },
            {
              "type": "text",
              "text": "Laporan otomatis ditutup jika dalam 5 menit belum ditandai \"selesai\" dan tidak ada pembaharuan lebih lanjut terhadap laporan",
              "size": "md",
              "margin": "lg",
              "color": "#f8f8f8",
              "wrap": true
            }
          ]
        },
        "styles": {
          "body": {
            // "backgroundColor": "#FFF6F6",
            "backgroundColor": "#ff9b9b"
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
              "align": "start",
            },
            {
              "margin": "lg",
              "type": "text",
              "text": "Info tambahan",
              "size": "xl",
              "align": "start",
              "color": "#ffffff",
              "weight": "bold"
            },
            {
              "type": "separator",
              "margin": "lg",
              "color": "#009c9e",
            },
            {
              "type": "text",
              "text": "Tambahkan informasi lebih lanjut mengenai laporanmu dengan mengirimkan pesan berupa teks",
              "size": "md",
              "margin": "lg",
              "color": "#f8f8f8",
              "wrap": true
            }
          ]
        },
        "styles": {
          "body": {
            "backgroundColor": "#00aaac"
          }
        }
      }
    ]
  }
})