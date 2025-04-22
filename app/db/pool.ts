import * as dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schemas';

dotenv.config();

const client = createClient({
  url: process.env.LIBSQL_DB_URL || 'file:gugukun.db',
});

export const db = drizzle(client, { schema });
