import { foreignKey, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const enrollments = sqliteTable('enrollments', {
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  reminderChannelId: text('reminder_channel_id').notNull(),
  deadline: text('deadline').notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.guildId, table.userId] }),
  };
});

export const firedReminders = sqliteTable('fired_reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  firedAt: text('fired_at').notNull(),
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
  createdAt: text('created_at').notNull(),
}, (table) => {
  return {
    enrollment: foreignKey({
      columns: [table.guildId, table.userId],
      foreignColumns: [enrollments.guildId, enrollments.userId],
    }),
  };
});
