import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { creatives } from './creatives';
import { targetingGroups } from './targeting-groups';

export const targetingGroupCreatives = pgTable('targeting_group_creatives', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  targetingGroupId: uuid('targeting_group_id')
    .notNull()
    .references(() => targetingGroups.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  creativeId: uuid('creative_id')
    .notNull()
    .references(() => creatives.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const targetingGroupCreativesRelations = relations(
  targetingGroupCreatives,
  ({ one }) => ({
    targetingGroup: one(targetingGroups, {
      fields: [targetingGroupCreatives.targetingGroupId],
      references: [targetingGroups.id],
    }),
    creative: one(creatives, {
      fields: [targetingGroupCreatives.creativeId],
      references: [creatives.id],
    }),
  }),
);

export const SelectTargetingGroupCreativeSchema = createSelectSchema(
  targetingGroupCreatives,
);

export const InsertTargetingGroupCreativeSchema = createInsertSchema(
  targetingGroupCreatives,
  {
    targetingGroupId: z.string().uuid(),
    creativeId: z.string().uuid(),
  },
);

export type TargetingGroupCreative = z.infer<
  typeof SelectTargetingGroupCreativeSchema
>;

export type FormTargetingGroupCreative = z.infer<
  typeof InsertTargetingGroupCreativeSchema
>;
