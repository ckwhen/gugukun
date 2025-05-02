import { MessageEvent } from '@line/bot-sdk';
import { LineText, LinesText } from '../types';
import { contants, phrases, strings } from '../utils';
import { createUserService } from '../domain/services';

const { createTextEcho } = strings;
const { PHRASE_TYPES } = contants;
const { getPhraseTextByType, checkPhraseTypeByMessage } = phrases;

const userService = createUserService();

export async function handleMessage(event: MessageEvent, client: any) {
  const {
    message,
    source: { userId },
  } = event;

  if (message.type !== 'text') {
    return Promise.resolve(null);
  }

  const { text: messageText } = message;
  const phraseType = checkPhraseTypeByMessage(messageText);
  const messages = [];

  messages.push(getPhraseTextByType(phraseType));

  if (userId && phraseType === PHRASE_TYPES.SET_GOAL) {
    userService.handleUserSetting(userId, messageText);
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_GOAL) {
    const user = await userService.handleUserFind(userId);

    messages[0] = getPhraseTextByType(phraseType, { cc: user?.targetWater });
  }

  if (userId && phraseType === PHRASE_TYPES.RECORD_WATER) {
    const amount = await userService.handleWaterLogCreate(userId, messageText);

    messages[0] = getPhraseTextByType(phraseType, { cc: amount });
  }

  if (userId && phraseType === PHRASE_TYPES.CHECK_CURRENT) {
    const progress = await userService.handleUserWaterProgress(userId);
    const {
      percentage,
      targetWater,
      totalWaterToday,
    } = progress;

    messages[0] = getPhraseTextByType(phraseType, { cc: totalWaterToday });
    messages.push(
      {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": {
          "type": "bubble",
          "size": "deca",
          "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "進度",
                "color": "#ffffff",
                "align": "start",
                "size": "md",
                "gravity": "center"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "color": "#ffffff",
                    "text": percentage
                  },
                  {
                    "type": "text",
                    "color": "#ffffff",
                    "text": `${totalWaterToday}/${targetWater}`,
                    "align": "end"
                  }
                ],
                "margin": "lg"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "filler"
                      }
                    ],
                    "width": percentage,
                    "backgroundColor": "#0D8186",
                    "height": "6px"
                  }
                ],
                "backgroundColor": "#9FD8E36E",
                "height": "6px",
                "margin": "md"
              }
            ],
            "backgroundColor": "#27ACB2",
            "paddingTop": "19px",
            "paddingAll": "12px",
            "paddingBottom": "16px"
          },
          "styles": {
            "body": {
              "separator": false
            },
            "footer": {
              "separator": false
            }
          }
        }
      }
    );
  }

  if (phraseType === PHRASE_TYPES.GET_HELP) {
    messages[0] = [
      '咕咕～咕咕君來提醒你摟咕',
      '只要輸入 help 我都會出現喔咕',
      '',
      getPhraseTextByType(phraseType),
    ];
  }

  const [ commonText, ...rest ] = messages;

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [ createTextEcho(commonText), ...rest ],
  });
};
