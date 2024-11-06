import { getTableColumns } from 'drizzle-orm';
import {
  doublePrecision,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums

export const environmentEnum = pgEnum('environment', ['dev', 'prod']);

// Tables

export const optionsDeals = pgTable(
  'options_deals',
  {
    beeswaxId: text('beeswax_id').notNull(),
    floor: doublePrecision('floor').notNull(),
    multiplier: doublePrecision('multiplier').notNull(),
    environment: environmentEnum('environment').notNull().default('dev'),
  },
  (optionsDeals) => {
    return {
      pk: primaryKey({
        name: 'options_deals_pkey',
        columns: [optionsDeals.environment, optionsDeals.beeswaxId],
      }),
    };
  },
);

// Schemas

export const SelectOptionsDealsSchema = createSelectSchema(optionsDeals);

export const OptionsDealsModel = getTableColumns(optionsDeals);

export const InsertOptionsDealsSchema = createInsertSchema(optionsDeals);

// Types

export type OptionsDeals = z.infer<typeof SelectOptionsDealsSchema>;
