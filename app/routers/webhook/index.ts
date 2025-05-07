import express from 'express';
import type { WebhookEvent } from '@line/bot-sdk';
import { createLineClient } from '../../adapters';
import { createUserService } from '../../domain/services';
import { handleFollow } from './followHandler';
import { handleMessage } from './messageHandler';
import { ReplyMessageRequestType } from './utils';

const userService = createUserService();
const lineClient = createLineClient();

export const router = express.Router();

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

router.post('/', async (req, res) => {
  const events = req.body.events;
  await Promise.all(
      events.map(async (event: WebhookEvent) => {
        const reply = await handleEvent(event);

        if (!reply) {
          return null;
        }

        return lineClient.replyMessage(reply);
      })
    )
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});