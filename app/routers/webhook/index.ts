import express from 'express';
import type { WebhookEvent } from '@line/bot-sdk';
import { createLineClient } from '../../adapters';
import { createUserService } from '../../domain/services';
import { ILogger } from '../../domain/interfaces';
import { handleFollow } from './followHandler';
import { handleMessage } from './messageHandler';
import { ReplyMessageRequestType } from './utils';

export function createRouter(logger: ILogger) {
  const router = express.Router();
  const userService = createUserService();
  const lineClient = createLineClient();

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

    try {
      await userService.ensureUserExists(userId);
    } catch (err) {
      logger.error('Failed to ensure user exists', { userId, error: err });
      return null;
    }

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
    const results = await Promise.all(
        events.map(async (event: WebhookEvent) => {
          try {
            const reply = await handleEvent(event);
            if (!reply) return null;

            await lineClient.replyMessage(reply);
            return { status: 'success', userId: event.source?.userId };
          } catch (err) {
            logger.error('Error handling webhook event', {
              error: err,
              eventType: event.type,
              userId: event.source?.userId,
            });
            return { status: 'failed', userId: event.source?.userId };
          }
        })
      );

    res.json(results);
  });

  return router;
}