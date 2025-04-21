import 'dotenv/config'
import express from 'express';
import * as line from '@line/bot-sdk';
import { createWebhookRouter } from './webhook/router.js';

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
app.use('/webhook', line.middleware(config), createWebhookRouter(client));

app.listen(port, () => {
  console.log(`咕咕君已啟動在 http://localhost:${port} 咕！`);
});
