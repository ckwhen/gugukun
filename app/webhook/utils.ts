type ProgressProps = {
  percentage: string;
  totalWaterToday: number;
  targetWater: number;
};

export const getProgressBubbleMessage = ({
  percentage,
  totalWaterToday,
  targetWater,
}: ProgressProps) => {
  return {
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
  };
}