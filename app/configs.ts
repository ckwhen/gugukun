export function getDatabaseUrl() {
  const {
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_NAME,
    DB_HOST = 'localhost',
  } = process.env;

  return `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

export function getLineChannel() {
  return {
    secret: process.env.LINE_CHANNEL_SECRET!,
    accessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  };
}
