import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  version: text('version').notNull(),
  pool: text('pool').notNull(),
  choices: text('choices'),
  summary: text('summary'),
  winner: text('winner'),
  createdAt: text('created_at').notNull(),
  completedAt: text('completed_at'),
});
