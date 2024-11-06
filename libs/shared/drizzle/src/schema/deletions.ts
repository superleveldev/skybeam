import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// --------------------------------------------------
// Enums
// --------------------------------------------------

export const DeletionObjectType = pgEnum('deletion_object_type', [
  'campaign',
  'advertiser',
  'creative',
  'targeting_group',
  'user',
  'organization',
]);

// --------------------------------------------------
// Table & Relations
// --------------------------------------------------

export const deletions = pgTable(
  'deletions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    objectType: DeletionObjectType('object_type').notNull(),
    objectId: text('object_id').notNull(),
    deletedBy: varchar('deleted_by', { length: 256 }).notNull(),
    data: jsonb('data').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unq: unique('deletion_table_object_id').on(t.objectType, t.objectId),
  }),
);

export const deletionsRelations = relations(deletions, ({ one }) => ({
  user: one(users, { fields: [deletions.deletedBy], references: [users.id] }),
}));

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const InsertDeletionSchema = createInsertSchema(deletions);
export const SelectDeletionSchema = createSelectSchema(deletions);

// --------------------------------------------------
// Types
// --------------------------------------------------

export type Deletion = z.infer<typeof SelectDeletionSchema>;
export type FormDeletion = z.infer<typeof InsertDeletionSchema>;
