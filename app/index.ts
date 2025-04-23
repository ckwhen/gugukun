import dotenv from 'dotenv'; 
import express from 'express';
import * as line from '@line/bot-sdk';
import { createWebhookRouter } from './webhook/router';
import { setupReminderScheduler } from './schedules/reminder';

dotenv.config();

const port = process.env.PORT;
// create LINE SDK config from env variables
const lineMiddlewareConfig = <line.MiddlewareConfig>{
  channelSecret: process.env.CHANNEL_SECRET,
};
// create LINE SDK client
const lineClient = new line.messagingApi.MessagingApiClient(
  <line.ClientConfig>{
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
  }
);

const app = express();

// entry
app.use('/webhook',
  line.middleware(lineMiddlewareConfig),
  createWebhookRouter(lineClient)
);

app.listen(port, () => {
  console.log(`咕咕君已啟動在 http://localhost:${port} 咕！`);
  setupReminderScheduler();
});
