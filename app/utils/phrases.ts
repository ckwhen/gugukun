import { PHRASE_TYPES, rules } from './contants';

const {
  SET_GOAL,
  CHECK_GOAL,
  CHECK_CURRENT,
  RECORD_WATER,
  REMINDER,
  ENCOURAGE,
  DEFAULT,
  GET_HELP,
} = PHRASE_TYPES;

const phrases = new Map([
  [
    SET_GOAL,
    [
      '飲水目標設定好了咕！我會盯著你喝的咕～',
      '哇～你設定得真棒咕！咕咕君很欣賞有計畫的小雞咕！',
      '小雞有目標就不會迷路咕！補水大作戰開始咕！',
      '記住這個數字咕！今天喝完就大功告成咕！',
      '咕咕咕～目標已記錄，接下來就是執行咕！',
    ],
  ],
  [
    CHECK_GOAL,
    [
      '你的目標是 ${cc}cc 喔咕，小雞要努力咕！',
      '咕咕君記得的，小雞今天要喝 ${cc}cc 咕！',
      '補水任務：${cc}cc 咕～加油咕！',
      '${cc}cc 是你的今日任務水量咕～我會陪你一起咕！',
    ],
  ],
  [
    CHECK_CURRENT,
    [
      '目前進度：${cc}cc 咕～離目標不遠咕！',
      '喝了 ${cc}cc 咕，好棒咕～再喝一點就更棒咕！',
      '咕咕君幫你記著，目前是 ${cc}cc 咕～',
    ],
  ], [
    RECORD_WATER,
    [
      '你喝了 ${cc}cc 喔咕，小雞要努力咕！',
      '喝水＋${cc}cc 成功咕！咕咕君替你歡呼咕～',
      '${cc}cc 收到咕！記錄下來囉咕～',
      '好水好水，${cc}cc 寫進小雞筆記本了咕！',
    ],
  ],
  [
    REMINDER,
    [
      '咕咕～該喝水了咕！',
      '水水喝起來，小雞才有活力咕！',
      '不喝水就不能變成閃亮的小雞哦咕！',
      '今天也要乖乖補水咕～',
      '咕咕君正在看著你喔…快去喝一杯水咕！',
      '咕咕咕！水瓶空空，小雞快行動咕！',
      '咕咕小叮嚀：水不是裝飾，快喝咕～',
    ],
  ],
  [
    ENCOURAGE,
    [
      '喝水不偷懶，小雞才勇敢咕！',
      '一起變成閃閃發亮的健康雞咕！',
      '今天也加油補水咕！咕咕君愛你喔咕！',
      '咕咕君覺得你超棒咕！喝水也是一種堅持咕！',
      '只要每天一點一點，小雞也能喝光整個池塘咕！',
    ],
  ], [
    DEFAULT,
    [
      '咕咕～你可以用「設定 2000cc」或「設定體重 60」來告訴我你的飲水目標喔咕 🐤💧',
      '咕咕君有點聽不懂咕…可以再說一次嗎咕？',
      '咕咕咕？你想設定目標還是記錄水量咕～',
      '如果想幫我進步，也可以多試幾種說法咕 🐣',
    ],
  ],
  [
    GET_HELP,
    [
      '紀錄你了多少的水咕：\n👉 喝水 {xxx}cc\n👉 喝了 {xxx}cc\n查詢今日進度咕：\n👉 進度\n查詢你的每日目標咕：\n👉 查詢\n👉 目標',
    ],
  ]
]);

function getRandom(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function checkPhraseTypeByMessage(message = '') {
  const text = message.toLowerCase();

  if (rules.setting.exec(text)) return SET_GOAL;
  if (rules.goalChecking.exec(text)) return CHECK_GOAL;
  if (rules.currentChecking.exec(text)) return CHECK_CURRENT;
  if (rules.waterRecording.exec(text)) return RECORD_WATER;
  if (rules.help.exec(text)) return GET_HELP;

  return DEFAULT;
}

export function getPhraseTextByType(type = DEFAULT, params = {}) {
  const list = phrases.get(type) || phrases.get(DEFAULT);
  let text = getRandom(list);

  for (const [key, value] of Object.entries(params)) {
    text = text.replace(`\${${key}}`, value);
  }

  return text;
}
