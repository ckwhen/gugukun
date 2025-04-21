import { createTextEcho } from '../utils/string.js';

export function handleMessage(event, client) {
  const { message } = event;

  if (message.type !== 'text') {
    return Promise.resolve(null);
  }

  const text = `你說的是：「${message.text}」咕～我還在學習哦咕！`;

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(text) ],
  });
};
