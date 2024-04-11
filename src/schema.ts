import { foreignKey, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const enrollments = sqliteTable('enrollments', {
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  channelId: text('channel_id').notNull(),
  startingAt: integer('starting_at').notNull(),
  intervalHours: integer('interval_hours').notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.guildId, table.userId] }),
  };
});

export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  remindAt: integer('remind_at').notNull(),
  startAt: integer('fired'),
}, (table) => {
  return {
    enrollment: foreignKey({
      columns: [table.guildId, table.userId],
      foreignColumns: [enrollments.guildId, enrollments.userId],
    }),
  };
});

export const shares = sqliteTable('shares', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => {
  return {
    enrollment: foreignKey({
      columns: [table.guildId, table.userId],
      foreignColumns: [enrollments.guildId, enrollments.userId],
    }),
  };
});
