import { createTextEcho } from '../utils/string.js';
import {
  checkPhraseTypeByMessage,
  getPhraseText,
} from '../utils/phrases.js';

export function handleMessage(event, client) {
  const { message } = event;

  if (message.type !== 'text') {
    return Promise.resolve(null);
  }

  const phraseType = checkPhraseTypeByMessage(message.text);
  const text = getPhraseText(phraseType);

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(text) ],
  });
};
