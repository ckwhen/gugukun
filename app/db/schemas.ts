import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  weight: integer('weight'),
  targetWater: integer('target_water'),
  unit: text('unit'),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const waterLogs = sqliteTable('water_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id),
  remindType: text('remind_type'),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const userRelations = relations(users, ({ many }) => ({
  waterLogs: many(waterLogs),
  reminders: many(reminders),
}));
