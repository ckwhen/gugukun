import express from 'express';
import { createLineMiddleware } from './adapters';
import { router as webhookRouter } from './routers/webhook';
import { reminder as reminderRoute } from './routers/reminder';

const port = process.env.PORT || 3000;

const lineMiddleware = createLineMiddleware();

const app = express();

app.use('/webhook', lineMiddleware, webhookRouter);
app.use('/reminder', reminderRoute);

app.listen(port, () => {
  console.log(`咕咕君正在監聽 port:${port} 了咕！`);
});
