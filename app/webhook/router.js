import express from 'express';
import { handleFollow } from './followHandler.js';
import { handleMessage } from './messageHandler.js';

async function handleEvent(event, client) {
  switch (event.type) {
    case 'follow':
      return handleFollow(event, client);
    case 'message':
      return handleMessage(event, client);
    default:
      return Promise.resolve(null);
  }
};

export function createWebhookRouter(client) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const events = req.body.events;
    await Promise.all(events.map(event => handleEvent(event, client)))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  return router;
}
