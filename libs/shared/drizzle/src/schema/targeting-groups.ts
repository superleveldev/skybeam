import {
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { campaigns } from './campaigns';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { targetingGroupCreatives } from './targeting-group-creatives';
import { budgetTypeEnum } from './shared';

// --------------------------------------------------
// Enums
// --------------------------------------------------

export const targetModeEnum = pgEnum('target_mode', ['include', 'exclude']);
const beeswaxSyncEnum = pgEnum('beeswax_sync', [
  'success',
  'pending',
  'failure',
]);

// --------------------------------------------------
// Targeting Groups Table
// --------------------------------------------------

export const targetingGroups = pgTable('targeting_groups', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => campaigns.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  age: jsonb('age').$type<string[]>().notNull().default([]),
  budget: doublePrecision('budget').notNull(),
  budgetType: budgetTypeEnum('budget_type').notNull().default('daily'),
  categories: jsonb('categories').$type<string[]>().notNull().default([]),
  targetMode: targetModeEnum('target_mode').notNull().default('include'),
  gender: jsonb('gender').$type<string[]>().notNull().default([]),
  geoCities: jsonb('geo_cities').$type<string[]>().notNull().default([]),
  geoZipCodes: jsonb('geo_zip_codes').$type<string[]>().notNull().default([]),
  inventories: jsonb('inventories').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
  altId: integer('alt_id').generatedAlwaysAsIdentity(),
  externalId: text('external_id'),
  beeswaxSync: beeswaxSyncEnum('beeswax_sync'),
  targetingExpressionId: text('targeting_expression_id'),
  bidModifierId: text('bid_modifier_id'),
});

export const targetingGroupsRelations = relations(
  targetingGroups,
  ({ many, one }) => ({
    campaign: one(campaigns, {
      fields: [targetingGroups.campaignId],
      references: [campaigns.id],
    }),
    targetingGroupCreatives: many(targetingGroupCreatives),
  }),
);

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const SelectTargetingGroupSchema = createSelectSchema(targetingGroups);

export const InsertTargetingGroupSchema = createInsertSchema(targetingGroups, {
  name: (schema) =>
    schema.name
      .min(1, "Name can't be empty")
      .max(255, 'Name must be less than 255 characters'),
  age: z.array(z.string()),
  budget: z.number().positive(),
  categories: z.array(z.string()),
  gender: z.array(z.string()),
  geoCities: z.array(z.string()),
  geoZipCodes: z.array(z.string()),
  inventories: z.array(z.string()),
});

export type TargetingGroup = z.infer<typeof SelectTargetingGroupSchema>;

export type FormTargetingGroup = z.infer<typeof InsertTargetingGroupSchema>;
