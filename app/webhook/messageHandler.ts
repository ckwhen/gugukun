import { MessageEvent } from '@line/bot-sdk';
import { LineText } from '../types';
import { PHRASE_TYPES } from '../utils/contants';
import { createTextEcho } from '../utils/string';
import { db } from '../db/pool';
import { UserRepository, WaterLogRepository } from '../db/repositories';
import { UserService } from '../domain/services';
import {
  checkPhraseTypeByMessage,
  getPhraseTextByType,
} from '../utils/phrases';

const userRepo = new UserRepository(db);
const waterLogRepo = new WaterLogRepository(db);
const userService = new UserService(userRepo, waterLogRepo);

export async function handleMessage(event: MessageEvent, client: any) {
  const {
    message,
    source: { userId },
  } = event;

  if (message.type !== 'text') {
    return Promise.resolve(null);
  }

  const { text: messageText } = message;
  const phraseType = checkPhraseTypeByMessage(messageText);
  let text: LineText = getPhraseTextByType(phraseType);

  if (userId && phraseType === PHRASE_TYPES.SET_GOAL) {
    userService.handleUserSetting(userId, messageText);
  }

  if (userId && phraseType === PHRASE_TYPES.RECORD_WATER) {
    const amount = await userService.handleWaterLogCreate(userId, messageText);

    text = getPhraseTextByType(phraseType, { cc: amount });
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_CURRENT) {
    const total = await userService.handleTodayTotalWater(userId);

    text = getPhraseTextByType(phraseType, { cc: total });
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(`${userId}: ${text}`) ],
  });
};
