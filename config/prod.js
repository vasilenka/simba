module.exports = {
  database: process.env.MONGODB_URL,
  bot: {
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  },
  url: process.env.HOSTNAME,
  webUrl: process.env.WEBHOSTNAME,
}