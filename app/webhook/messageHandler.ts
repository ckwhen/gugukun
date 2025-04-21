import { MessageEvent } from '@line/bot-sdk';
import { LineText } from '../interfaces';
import { createTextEcho } from '../utils/string';
import {
  checkPhraseTypeByMessage,
  getPhraseText,
} from '../utils/phrases';

export function handleMessage(event: MessageEvent, client: any) {
  const { message } = event;

  if (message.type !== 'text') {
    return Promise.resolve(null);
  }

  const phraseType = checkPhraseTypeByMessage(message.text);
  const text: LineText = getPhraseText(phraseType);

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(text) ],
  });
};
