import { MessageEvent } from '@line/bot-sdk';
import { LineText, LinesText } from '../types';
import { contants, phrases, strings } from '../utils';
import { db } from '../db/client';
import { UserRepository, WaterLogRepository } from '../db/repositories';
import { UserService } from '../domain/services';

const { createTextEcho } = strings;
const { PHRASE_TYPES } = contants;
const { getPhraseTextByType, checkPhraseTypeByMessage } = phrases;

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
  let text: LinesText | LineText = getPhraseTextByType(phraseType);

  if (userId && phraseType === PHRASE_TYPES.SET_GOAL) {
    userService.handleUserSetting(userId, messageText);
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_GOAL) {
    const user = await userService.handleUserFind(userId);

    text = getPhraseTextByType(phraseType, { cc: user?.targetWater });
  }

  if (userId && phraseType === PHRASE_TYPES.RECORD_WATER) {
    const amount = await userService.handleWaterLogCreate(userId, messageText);

    text = getPhraseTextByType(phraseType, { cc: amount });
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_CURRENT) {
    const total = await userService.handleTodayTotalWater(userId);

    text = getPhraseTextByType(phraseType, { cc: total });
  }

  if (phraseType === PHRASE_TYPES.GET_HELP) {
    text = [
      '咕咕～咕咕君來提醒你摟咕',
      '只要輸入 help 我都會出現喔咕',
      '',
      getPhraseTextByType(phraseType),
    ];
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(text) ],
  });
};
