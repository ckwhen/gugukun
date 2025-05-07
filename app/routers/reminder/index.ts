import express from 'express';
import chunk from 'lodash/chunk';
import { createReminderService } from '../../domain/services';
import { UserEntity, UserId } from '../../domain/entities';
import { contants, phrases } from '../../utils';
import { createLineMessageAdapter } from '../../adapters';

const { PHRASE_TYPES, CHUNK_SIZE } = contants;
const { getPhraseTextByType } = phrases;

const lineMessenger = createLineMessageAdapter();
const reminderService = createReminderService();

async function sendReminderToUser(userId: UserId) {
  const text = getPhraseTextByType(PHRASE_TYPES.REMINDER);

  lineMessenger.sendMessage(userId, text);
  console.log(`Sending message to ${userId}`);
}

async function runJobWithUsers(jobFn: (userId: UserId) => Promise<void>, label: string) {
  const users = await reminderService.getAllUsers();
  const chunks = chunk(users, CHUNK_SIZE);

  for (const group of chunks) {
    await Promise.all(group.map((user: UserEntity) => jobFn(user?.id)));
  }

  console.log(`[${label}] Job done at`, new Date().toLocaleTimeString());
}

export const router = express.Router();

router.post('/', async (req, res) => {
  const secret = req.headers['x-cron-secret'];

  if (secret !== process.env.REMINDER_SECRET_KEY) {
    res.status(403).send('Forbidden');
    return;
  }

  const slot = req.body.slot as string || '';

  await runJobWithUsers(sendReminderToUser, slot);

  res.status(200).send('Reminder triggered!');
});
