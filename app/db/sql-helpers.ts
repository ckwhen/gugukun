import { sql, SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

export function sum<T extends number>(column: PgColumn): SQL<T> {
  return sql<T>`sum(${column})`;
}

export function equalToday<T>(column: PgColumn): SQL<T> {
  return sql<T>`DATE(${column}) = CURRENT_DATE`;
}
