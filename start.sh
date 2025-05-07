#!/bin/bash

ENV=""

# 根據命令行參數選擇環境
if [ "$1" == "development" ]; then
  ENV="development.local"
elif [ "$1" == "production" ]; then
  ENV="production.local"
elif [ "$1" == "local" ]; then
  ENV="local"
else
  echo "未指定有效的環境 (development, production, local)，默認使用 local"
  ENV="local"
fi

# 複製選擇的檔案到 .env
echo "Load env file: $ENV"
npx ts-node scripts/set-env.ts $ENV

echo "Set Docker .env and Build"
docker-compose --env-file ./.env up --build
