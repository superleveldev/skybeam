import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const permissions = pgTable('permissions', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'perm_2Ym16qDMKg37umUxkqDlizY7dfi',
  description: text('description'), //'Custom permission to manage organization billing',
  key: varchar('key', { length: 256 }), //'org:billing:manage',
  name: varchar('name', { length: 256 }), //'manage billing permission',
  type: varchar('type', { length: 256 }), //'user',
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
