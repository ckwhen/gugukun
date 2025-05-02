import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { timestamps } from '../column-helpers';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  weight: integer('weight'),
  targetWater: integer('target_water'),
  ...timestamps,
});
