import express from 'express';
import { createLineMiddleware, createLineClient } from './adapters';
import { createWebhookRouter } from './webhook/router';

const port = process.env.PORT || 3000;

const lineMiddleware = createLineMiddleware();
const lineClient = createLineClient();

const app = express();

app.use('/webhook',
  lineMiddleware,
  createWebhookRouter(lineClient)
);

app.listen(port, () => {
  console.log(`咕咕君已啟動在 http://localhost:${port} 咕！`);
});
