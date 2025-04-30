import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseUrl } from '../configs';
import * as schemas from './schemas';
import * as relations from './relations';

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

export const db = drizzle(pool, {
  schema: {
    ...schemas,
    ...relations,
  },
});
