import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseUrl } from '../configs';
import * as schemas from './schemas';
import * as relations from './relations';

type SchemaType = typeof schemas & typeof relations;

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

const schema: SchemaType = {
  ...schemas,
  ...relations,
};

export const db = drizzle(pool, { schema });

export type DB = typeof db;