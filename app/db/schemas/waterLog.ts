import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { users } from './user';

export const waterLogs = pgTable('water_logs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()),
});