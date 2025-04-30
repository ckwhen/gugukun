import * as cron from 'node-cron';
import chunk from 'lodash/chunk';
import { LineText } from '../types';
import { createReminderService } from '../domain/services';
import { UserEntity, UserId } from '../domain/entities';
import { contants, phrases } from '../utils';
import { createLineMessageAdapter } from '../adapters';

const { PHRASE_TYPES, CHUNK_SIZE } = contants;
const { getPhraseTextByType } = phrases;

const lineMessenger = createLineMessageAdapter();
const reminderService = createReminderService();

async function sendReminderToUser(userId: UserId) {
  const text: LineText = getPhraseTextByType(PHRASE_TYPES.REMINDER);

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

export async function setupReminderScheduler() {
  console.log('Setting up daily reminder jobs...');

  cron.schedule('0 0 8 * * 1-5', () => runJobWithUsers(sendReminderToUser, 'Morning'));
  cron.schedule('0 0 12 * * 1-5', () => runJobWithUsers(sendReminderToUser, 'Noon'));
  cron.schedule('0 0 16 * * 1-5', () => runJobWithUsers(sendReminderToUser, 'Afternoon'));

  console.log('Reminder jobs scheduled.');
}
