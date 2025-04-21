import { PHRASE_TYPES } from './contants';

const {
  REMINDER,
  RECORD,
  SET_WATER_AMOUNT_GOAL,
  SET_WEIGHT_GOAL,
  CHECK_GOAL,
  ENCOURAGE,
  DEFAULT,
  UNKNOWN,
  RESET,
} = PHRASE_TYPES;

const phrases = {
  [REMINDER]: [
    '咕咕～該喝水了咕！',
    '水水喝起來，小雞才有活力咕！',
    '不喝水就不能變成閃亮的小雞哦咕！',
    '今天也要乖乖補水咕～',
    '咕咕君正在看著你喔…快去喝一杯水咕！'
  ],
  [SET_WATER_AMOUNT_GOAL]: [
    '飲水目標設定好了咕！我會盯著你喝的咕～',
    '哇～你設定得真棒咕！咕咕君很欣賞有計畫的小雞咕！'
  ],
  [SET_WEIGHT_GOAL]: [
    '體重記下來了咕！幫你算好每天要喝幾 cc 水咕～',
    '哇～你設定得真棒咕！咕咕君很欣賞有計畫的小雞咕！'
  ],
  [CHECK_GOAL]: [
    '你的目標是 ${cc}cc 喔咕，小雞要努力咕！',
    '設定來源是 ${source}，咕咕君記得很清楚咕～'
  ],
  [ENCOURAGE]: [
    '喝水不偷懶，小雞才勇敢咕！',
    '一起變成閃閃發亮的健康雞咕！',
    '今天也加油補水咕！咕咕君愛你喔咕！'
  ],
  [DEFAULT]: [
    '咕咕～你可以用「設定 2000cc」或「設定體重 60」來告訴我你的飲水目標喔咕 🐤💧',
    '你說的是：「${text}」咕～我還在學習哦咕！'
  ]
};

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function checkPhraseTypeByMessage(message = '') {
  const text = message.toLowerCase();

  if (text.match(/設定.*(目標|水|cc)/)) return SET_WATER_AMOUNT_GOAL;
  if (text.match(/(喝了|補水|剛剛喝).*\d+cc/)) return RECORD;
  if (text.match(/(今天|目前).*(喝了|進度)/)) return CHECK_GOAL;
  if (text.includes('重設') || text.includes('清除')) return RESET;

  return UNKNOWN;
}

export function getPhraseText(type = DEFAULT, vars = {}) {
  const list = phrases[type] || phrases[DEFAULT];
  let text = getRandom(list);

  for (const [key, value] of Object.entries(vars)) {
    text = text.replace(`\${${key}}`, value);
  }

  return text;
}
