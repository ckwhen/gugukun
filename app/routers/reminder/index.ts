import express from 'express';
import chunk from 'lodash/chunk';
import { createReminderService } from '../../domain/services';
import { UserEntity, UserId } from '../../domain/entities';
import { ILogger } from '../../domain/interfaces';
import { contants, phrases } from '../../utils';
import { createLineMessageAdapter } from '../../adapters';

const { PHRASE_TYPES, CHUNK_SIZE } = contants;
const { getPhraseTextByType } = phrases;

export function createRouter(logger: ILogger) {
  const router = express.Router();
  const lineMessenger = createLineMessageAdapter();
  const reminderService = createReminderService();

  async function sendReminderToUser(userId: UserId) {
    const text = getPhraseTextByType(PHRASE_TYPES.REMINDER);

    lineMessenger.sendMessage(userId, text);
    logger.info('Sending reminder', { userId });
  }

  async function runJobWithUsers(jobFn: (userId: UserId) => Promise<void>, label: string) {
    const users = await reminderService.getAllUsers();
    const chunks = chunk(users, CHUNK_SIZE);

    for (const group of chunks) {
      await Promise.all(group.map((user: UserEntity) => jobFn(user?.id)));
    }

    logger.info(`[${label}] Job done`);
  }

  router.post('/', async (req, res) => {
    try {
      const rawSecret = req.headers['x-cron-secret'];
      const secret = Array.isArray(rawSecret) ? rawSecret[0] : rawSecret;

      if (secret?.trim() !== process.env.REMINDER_SECRET_KEY?.trim()) {
        logger.warn('Invalid reminder secret', { ip: req.ip });
        res.status(403).send('Forbidden');
        return;
      }

      const slot = (req.body.slot as string) || '';
      await runJobWithUsers(sendReminderToUser, slot);

      logger.info('Reminder job executed successfully', { slot });
      res.status(200).send('Reminder triggered!');
    } catch (err) {
      logger.error('Failed to execute reminder job', {
        error: err,
        ip: req.ip,
        body: req.body,
      });
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}