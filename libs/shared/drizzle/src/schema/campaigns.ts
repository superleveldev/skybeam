import { getTableColumns, relations, sql } from 'drizzle-orm';
import {
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { advertisers } from './advertisers';
import { stripeInvoices } from './stripe-invoices';
import { budgetTypeEnum } from './shared';
import { targetingGroups } from './targeting-groups';
import { advertiserPixels } from './pixel';

// Enums

export const objectiveEnum = pgEnum('objective', [
  'awareness',
  'performance',
  'retargeting',
  'conquering',
]);

export const frequencyPeriodEnum = pgEnum('frequency_period', ['day', 'week']);

export const statusEnum = pgEnum('status', ['draft', 'published', 'finished']);

export const beeswaxSyncEnum = pgEnum('beeswax_sync', [
  'success',
  'pending',
  'failure',
]);

export const defaultTimezone = {
  value: 'Etc/GMT',
  label: '(GMT+0:00) UTC',
  offset: 0,
  abbrev: 'GMT',
  altName: 'British Standard Time',
};

// Tables

export const campaigns = pgTable(
  'campaigns',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    budget: integer('budget').notNull(),
    budgetType: budgetTypeEnum('budget_type').notNull().default('daily'),
    objective: objectiveEnum('objective').notNull().default('awareness'),
    frequency: integer('frequency').notNull().default(1),
    frequencyPeriod: frequencyPeriodEnum('frequency_period')
      .notNull()
      .default('day'),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    timezone: jsonb('timezone')
      .$type<typeof defaultTimezone>()
      .notNull()
      .default(defaultTimezone),
    status: statusEnum('status').notNull().default('draft'),
    fee: doublePrecision('fee').notNull().default(0.4),

    advertiserId: uuid('advertiser_id')
      .notNull()
      .references(() => advertisers.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    pixelId: uuid('pixel_id').references(() => advertiserPixels.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),

    altId: integer('alt_id').generatedAlwaysAsIdentity(),
    externalId: text('external_id'),
    beeswaxSync: beeswaxSyncEnum('beeswax_sync'),
  },
  (t) => ({
    unq: unique('campaign_name').on(t.advertiserId, t.name),
  }),
);

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  advertiser: one(advertisers, {
    fields: [campaigns.advertiserId],
    references: [advertisers.id],
  }),
  pixel: one(advertiserPixels, {
    fields: [campaigns.pixelId],
    references: [advertiserPixels.id],
  }),
  targetingGroups: many(targetingGroups),
  stripeInvoices: many(stripeInvoices),
}));

// Schemas

export const SelectCampaignSchema = createSelectSchema(campaigns, {
  timezone: z.object({
    value: z.string(),
    label: z.string(),
    offset: z.number(),
    abbrev: z.string(),
    altName: z.string(),
  }),
});

export const CampaignModel = getTableColumns(campaigns);

export const InsertCampaignSchema = createInsertSchema(campaigns, {
  name: (schema) =>
    schema.name
      .min(1, "Name can't be empty")
      .max(255, 'Name must be less than 255 characters'),
  advertiserId: z.string().min(1, 'Advertiser must be selected'),
  startDate: z.date(),
  endDate: z.date().min(new Date(), 'End date must be in the future'),
  timezone: z.object({
    value: z.string(),
    label: z.string(),
    offset: z.number(),
    abbrev: z.string(),
    altName: z.string(),
  }),
});

export const campaignSortSchema = SelectCampaignSchema.extend({
  dailyBudget: z.number().optional(),
  totalBudget: z.number().optional(),
}).keyof();

// Types

export type Campaign = z.infer<typeof SelectCampaignSchema>;
export type FormCampaign = z.infer<typeof InsertCampaignSchema>;
