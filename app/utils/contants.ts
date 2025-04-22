export enum PHRASE_TYPES {
  SET_GOAL,
  CHECK_GOAL,
  CHECK_CURRENT,
  RECORD_WATER,
  REMINDER,
  ENCOURAGE,
  DEFAULT,
  UNKNOWN,
};

export const AMOUNT_PER_WEIGHT = 30;

export const rules = {
  setting: /設定.*?(\d+).*?(ml|cc|kg)/i,
  goalChecking: /(查詢|目標)/i,
  currentChecking: /進度/i,
  waterRecording: /(喝水|喝了).*?(\d+)(ml|cc)?/i,
};
