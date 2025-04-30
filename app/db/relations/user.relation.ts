import { relations } from 'drizzle-orm';
import { users, waterLogs } from '../schemas';

export const userRelations = relations(users, ({ many }) => ({
  waterLogs: many(waterLogs),
}));
