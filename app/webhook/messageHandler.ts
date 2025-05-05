import { MessageEvent } from '@line/bot-sdk';
import { contants, phrases, strings } from '../utils';
import { createUserService } from '../domain/services';
import { getProgressBubbleMessage } from './utils';

const { createTextEcho } = strings;
const { PHRASE_TYPES } = contants;
const { getPhraseTextByType, checkPhraseTypeByMessage } = phrases;

const userService = createUserService();

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
  const messages = [];

  messages.push(getPhraseTextByType(phraseType));

  if (userId && phraseType === PHRASE_TYPES.SET_GOAL) {
    userService.handleUserSetting(userId, messageText);
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_GOAL) {
    const user = await userService.handleUserFind(userId);

    messages[0] = getPhraseTextByType(phraseType, { cc: user?.targetWater });
  }

  if (userId && phraseType === PHRASE_TYPES.RECORD_WATER) {
    const amount = await userService.handleWaterLogCreate(userId, messageText);

    messages[0] = getPhraseTextByType(phraseType, { cc: amount });
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_CURRENT) {
    const progress = await userService.handleUserWaterProgress(userId);
    const {
      percentage,
      targetWater,
      totalWaterToday,
    } = progress;

    messages[0] = getPhraseTextByType(phraseType, { cc: totalWaterToday });
    messages.push(getProgressBubbleMessage({
      percentage,
      totalWaterToday,
      targetWater: targetWater ?? 0,
    }));
  }

  if (phraseType === PHRASE_TYPES.GET_HELP) {
    messages[0] = [
      '咕咕～咕咕君來提醒你摟咕',
      '只要輸入 help 我都會出現喔咕',
      '',
      getPhraseTextByType(phraseType),
    ];
  }

  const [ commonText, ...rest ] = messages;

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(commonText), ...rest ],
  });
};
