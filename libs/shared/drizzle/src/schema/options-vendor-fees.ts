import { getTableColumns } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { environmentEnum } from './options-deals';

// Enums

export const levelEnum = pgEnum('level', ['campaign', 'lineitem']);

// Tables

export const optionsVendorFees = pgTable(
  'options_vendor_fees',
  {
    name: text('name').notNull(),
    beeswaxId: integer('beeswax_id').notNull(),
    level: levelEnum('level').notNull().default('lineitem'),
    environment: environmentEnum('environment').notNull().default('dev'),
  },
  (optionsVendorFees) => {
    return {
      pk: primaryKey({
        name: 'options_vendors_pkey',
        columns: [
          optionsVendorFees.environment,
          optionsVendorFees.beeswaxId,
          optionsVendorFees.level,
          optionsVendorFees.name,
        ],
      }),
    };
  },
);

// Schemas

export const SelectOptionsVendorFeesSchema =
  createSelectSchema(optionsVendorFees);

export const OptionsVendorFeesModel = getTableColumns(optionsVendorFees);

export const InsertOptionsVendorFeesSchema =
  createInsertSchema(optionsVendorFees);

// Types

export type OptionsVendorFees = z.infer<typeof SelectOptionsVendorFeesSchema>;
