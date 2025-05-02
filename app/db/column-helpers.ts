import {
  timestamp,
  PgTimestampConfig,
} from 'drizzle-orm/pg-core';

const tzConfig: PgTimestampConfig = {
  mode: 'date',
  withTimezone: true,
};

export const timestamps = {
  updatedAt: timestamp('updated_at', tzConfig),
  createdAt: timestamp('created_at', tzConfig)
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at', tzConfig),
};
