import type { Config } from 'drizzle-kit';
import { getDatabaseUrl } from './app/configs';

export default {
  schema: ['./app/db/schemas', './app/db/relations'],
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: getDatabaseUrl() },
} satisfies Config;
