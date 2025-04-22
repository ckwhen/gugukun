import { FollowEvent } from '@line/bot-sdk';
import { LinesText } from '../types';
import { createTextEcho } from '../utils/string';
import { db } from '../db/pool';
import { UserRepository } from '../db/repositories';
import { UserService } from '../domain/services';

const userRepo = new UserRepository(db);
const userService = new UserService(userRepo);

export function handleFollow(event: FollowEvent, client: any) {
  const {
    source: { userId },
  } = event;

  const lines: LinesText = [
    '你好咕～我是喝水咕嚕咕嚕地咕咕君 🐣💧',
    '每天都會提醒你補充水分咕！',
    '',
    '在開始之前，請先設定你的基本資料咕：',
    '👉 輸入每日目標飲水量（例如：2000cc）',
    '👉 或輸入體重（例如：60kg）',
    '我會幫你算出建議飲水量哦咕！',
    '',
    '把下面的文字複製後修改吧咕！',
    '每日飲水量 2000cc',
    '體重 60kg',
  ];

  userId && userService.handleUserCreate(userId);

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(lines) ],
  });
};
