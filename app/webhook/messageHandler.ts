import { MessageEvent } from '@line/bot-sdk';
import { LineText } from '../types';
import { PHRASE_TYPES } from '../utils/contants';
import { createTextEcho } from '../utils/string';
import { db } from '../db/pool';
import { UserRepository } from '../db/repositories';
import { UserService } from '../domain/services';
import {
  checkPhraseTypeByMessage,
  getPhraseTextByType,
} from '../utils/phrases';

const userRepo = new UserRepository(db);
const userService = new UserService(userRepo);

export function handleMessage(event: MessageEvent, client: any) {
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

  if (phraseType === PHRASE_TYPES.SET_GOAL) {
    userId && userService.handleUserSetting(userId, messageText);
  }
  
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(`${userId}: ${text}`) ],
  });
};
