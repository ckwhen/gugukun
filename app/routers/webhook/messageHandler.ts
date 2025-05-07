import { MessageEvent, FlexMessage, TextMessage } from '@line/bot-sdk';
import { contants, phrases } from '../../utils';
import { createUserService } from '../../domain/services';
import { getProgressBubbleMessage, ReplyMessageRequestType } from './utils';

const { PHRASE_TYPES } = contants;
const { getPhraseTextByType, checkPhraseTypeByMessage } = phrases;

const userService = createUserService();

export async function handleMessage(
  event: MessageEvent
): Promise<ReplyMessageRequestType | null> {
  const {
    message,
    source: { userId },
  } = event;

  if (message.type !== 'text') {
    return Promise.resolve(null);
  }

  const { text: messageText } = message;
  const phraseType = checkPhraseTypeByMessage(messageText);
  const messages: TextMessage[] = [];
  const flexMessages: FlexMessage[] = [];

  messages.push({
    type: 'text',
    text: getPhraseTextByType(phraseType),
  } as TextMessage);

  if (userId && phraseType === PHRASE_TYPES.SET_GOAL) {
    userService.handleUserSetting(userId, messageText);
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_GOAL) {
    const user = await userService.handleUserFind(userId);

    messages[0].text = getPhraseTextByType(phraseType, { cc: user.targetWater ?? 0 });
  }

  if (userId && phraseType === PHRASE_TYPES.RECORD_WATER) {
    const amount = await userService.handleWaterLogCreate(userId, messageText);

    messages[0].text = getPhraseTextByType(phraseType, {
      cc: amount,
    });
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_CURRENT) {
    const progress = await userService.handleUserWaterProgress(userId);
    const {
      percentage,
      targetWater,
      totalWaterToday,
    } = progress;
    const progressText = getProgressBubbleMessage({
      percentage,
      totalWaterToday,
      targetWater: targetWater ?? 0,
    }) as FlexMessage;

    messages[0].text = getPhraseTextByType(phraseType, { cc: totalWaterToday });
    flexMessages.push(progressText);
  }

  if (phraseType === PHRASE_TYPES.GET_HELP) {
    messages[0].text = `
      咕咕～咕咕君來提醒你摟咕
      只要輸入 help 我都會出現喔咕

      ${getPhraseTextByType(phraseType)}
    `;
  }

  return Promise.resolve({
    replyToken: event.replyToken,
    messages: [ ...messages, ...flexMessages ] as any[],
  });
};
