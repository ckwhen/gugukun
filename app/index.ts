import express from 'express';
import * as line from '@line/bot-sdk';
import { getLineChannel } from './configs';
import { createWebhookRouter } from './webhook/router';
import { setupReminderScheduler } from './schedules/reminder';

const lineChannel = getLineChannel();

const port = process.env.PORT || 3000;

const lineMiddlewareConfig = <line.MiddlewareConfig>{
  channelSecret: lineChannel.secret,
};
const lineClient = new line.messagingApi.MessagingApiClient(
  <line.ClientConfig>{
    channelAccessToken: lineChannel.accessToken,
  }
);

const app = express();

app.use('/webhook',
  line.middleware(lineMiddlewareConfig),
  createWebhookRouter(lineClient)
);

app.listen(port, () => {
  console.log(`咕咕君已啟動在 http://localhost:${port} 咕！`);
  setupReminderScheduler();
});
