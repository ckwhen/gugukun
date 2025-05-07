import express from 'express';
import type { WebhookEvent } from '@line/bot-sdk';
import { createUserService } from '../../domain/services';
import { handleFollow } from './followHandler';
import { handleMessage } from './messageHandler';
import {
  MessagingApiClientType,
  ReplyMessageRequestType,
} from './utils';

const userService = createUserService();

async function handleEvent(
  event: WebhookEvent
): Promise<ReplyMessageRequestType | null> {
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
      return handleFollow(event);
    case 'message':
      return handleMessage(event);
    default:
      return Promise.resolve(null);
  }
};

export function createWebhookRouter(client: MessagingApiClientType) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const events = req.body.events;
    await Promise.all(
        events.map(async (event: WebhookEvent) => {
          const reply = await handleEvent(event);

          if (!reply) {
            return null;
          }

          return client.replyMessage(reply);
        })
      )
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  return router;
}
