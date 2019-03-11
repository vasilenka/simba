module.exports = (userId) => ({
  "type": "action",
  "imageUrl": "https://example.com/sushi.png",
  "action": {
    "type":"datetimepicker",
    "label": "Pilih tanggal lahirmu",
    "data":`{
      "action": "userId",
      "reportId": "${userId}"
    }`,
    "mode": "date",
    "initial": "1993-12-02",
    "max": "2018-12-31",
    "min": "1920-12-31",
  }
})