require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');


const port = process.env.PORT;
// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
};
// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

// entry
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type === 'follow') {
    const echo = {
      type: 'text',
      text: '你好咕～我是喝水咕嚕咕嚕的咕咕君，是你的每日喝水提醒小雞咕💧',
    };
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [echo],
    });
  }


  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  console.log(`event: ${event.message.text}`);

  const echo = { type: 'text', text: event.message.text };

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

app.listen(port, () => {
  console.log(`咕咕君正關注著～ port:${port}咕`);
});
