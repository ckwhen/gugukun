import { pgTable, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  weight: integer('weight'),
  targetWater: integer('target_water'),
  createdAt: text('created_at').default(new Date().toISOString()),
});
