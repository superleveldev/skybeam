import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'sess_29wBYxnMCQU2KIs6V3ZPOJCPUXx',
  clientId: varchar('client_id', { length: 256 }), //'client_29wBS3h1zhE1BsEK2dg9oyypfYk',
  status: varchar('status', { length: 256 }), //'active',
  userId: varchar('user_id', { length: 256 }).references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }), //'user_29wBMCtzATuFJut8jO2VNTVekS4',
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }), //1654014318265,
  expireAt: timestamp('expire_at', { withTimezone: true }), //1654619118265,
  abandonAt: timestamp('abandon_at', { withTimezone: true }), //1656606318265,
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
