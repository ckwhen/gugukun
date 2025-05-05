import express from 'express';
import { WebhookEvent } from '@line/bot-sdk';
import { handleFollow } from './followHandler';
import { handleMessage } from './messageHandler';
import { createUserService } from '../domain/services';

const userService = createUserService();

async function handleEvent(event: WebhookEvent, client: any) {
  const {
    type: eventType,
    source: { userId },
  } = event;

  if (!userId) {
    throw new Error('userId is required to ensure user existence');
  }

  await userService.ensureUserExists(userId);

  switch (eventType) {
    case 'follow':
      return handleFollow(event, client);
    case 'message':
      return handleMessage(event, client);
    default:
      return Promise.resolve(null);
  }
};

export function createWebhookRouter(client: any) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const events = req.body.events;
    await Promise.all(events.map((event: WebhookEvent) => handleEvent(event, client)))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  return router;
}
