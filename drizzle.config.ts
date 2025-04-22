import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

if (!process.env.LIBSQL_DATABASE_PATH) {
  throw Error(`process.env.LIBSQL_DATABASE_PATH isn't set!`);
}

const url = `${process.env.LIBSQL_DATABASE_PATH}`;

export default {
  schema: './app/db/schemas.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: { url },
  verbose: true,
  strict: true,
} satisfies Config;
