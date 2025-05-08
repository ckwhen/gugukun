import express from 'express';
import bodyParser from 'body-parser';
import { createLineMiddleware, createLogger } from './adapters';
import { createRouter as createWebhookRouter } from './routers/webhook';
import { createRouter as createReminderRouter } from './routers/reminder';

const port = process.env.PORT || 3000;

const lineMiddleware = createLineMiddleware();
const logger = createLogger();

const app = express();

app.use(bodyParser.urlencoded());

app.use('/webhook', lineMiddleware, createWebhookRouter(logger));
app.use('/reminder', createReminderRouter(logger));

app.listen(port, () => {
  logger.info(`gugukun is listening port:${port}`);
});
