import { PHRASE_TYPES, rules } from './contants';

const {
  SET_GOAL,
  CHECK_GOAL,
  CHECK_CURRENT,
  RECORD_WALTER,
  REMINDER,
  ENCOURAGE,
  DEFAULT,
  UNKNOWN,
} = PHRASE_TYPES;

const phrases = new Map([
  [
    SET_GOAL,
    [
      '飲水目標設定好了咕！我會盯著你喝的咕～',
      '哇～你設定得真棒咕！咕咕君很欣賞有計畫的小雞咕！',
    ],
  ], [
    CHECK_GOAL,
    [
      '你的目標是 ${cc}cc 喔咕，小雞要努力咕！',
    ],
  ], [
    CHECK_CURRENT,
    [
      '你喝了 ${cc}cc 喔咕，小雞要努力咕！',
    ],
  ], [
    REMINDER,
    [
      '咕咕～該喝水了咕！',
      '水水喝起來，小雞才有活力咕！',
      '不喝水就不能變成閃亮的小雞哦咕！',
      '今天也要乖乖補水咕～',
      '咕咕君正在看著你喔…快去喝一杯水咕！',
    ],
  ], [
    ENCOURAGE,
    [
      '喝水不偷懶，小雞才勇敢咕！',
      '一起變成閃閃發亮的健康雞咕！',
      '今天也加油補水咕！咕咕君愛你喔咕！',
    ],
  ], [
    DEFAULT,
    [
      '咕咕～你可以用「設定 2000cc」或「設定體重 60」來告訴我你的飲水目標喔咕 🐤💧',
      '你說的是：「${text}」咕～我還在學習哦咕！',
    ],
  ],
]);

function getRandom(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function checkPhraseTypeByMessage(message = '') {
  const text = message.toLowerCase();

  if (rules.setting.exec(text)) return SET_GOAL;
  if (rules.goalChecking.exec(text)) return CHECK_GOAL;
  if (rules.currentChecking.exec(text)) return CHECK_CURRENT;
  if (rules.walterRecording.exec(text)) return RECORD_WALTER;

  return UNKNOWN;
}

export function getPhraseTextByType(type = DEFAULT, params = {}) {
  const list = phrases.get(type) || phrases.get(DEFAULT);
  let text = getRandom(list);

  for (const [key, value] of Object.entries(params)) {
    text = text.replace(`\${${key}}`, value);
  }

  return text;
}
