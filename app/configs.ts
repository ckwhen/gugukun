import dotenv from 'dotenv';

dotenv.config();

export function getLogLevel() {
  return process.env.LOG_LEVEL;
}

export function getDatabaseUrl() {
  return `${process.env.DB_URL}`;
}

export function getLineChannel() {
  return {
    secret: process.env.LINE_CHANNEL_SECRET!,
    accessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  };
}
