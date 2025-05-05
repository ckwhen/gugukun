import { FollowEvent } from '@line/bot-sdk';
import { LinesText } from '../types';
import { contants, phrases, strings } from '../utils';
import { ReplyMessageRequestType } from './utils';

const { createTextEcho } = strings;
const { PHRASE_TYPES } = contants;
const { getPhraseTextByType } = phrases;

export function handleFollow(
  event: FollowEvent
): Promise<ReplyMessageRequestType | null> {
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
    '設定 2000cc',
    '設定 60kg',
  ];
  const helpLines: LinesText = [
    '另外還有這些指令可以參考喔咕',
    '',
    getPhraseTextByType(PHRASE_TYPES.GET_HELP),
    '',
    '未來如果忘記了咕，輸入 help 我就會提醒你摟咕',
  ];

  return Promise.resolve({
    replyToken: event.replyToken,
    messages: [ createTextEcho(lines), createTextEcho(helpLines) ],
  });
};
