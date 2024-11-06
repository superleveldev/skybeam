import { getTableColumns } from 'drizzle-orm';
import { integer, primaryKey, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { environmentEnum } from './options-deals';

// Tables

export const optionsInventories = pgTable(
  'options_inventories',
  {
    name: text('name').notNull(),
    listName: text('list_name').notNull(),
    beeswaxListId: integer('beeswax_list_id').notNull(),
    environment: environmentEnum('environment').notNull().default('dev'),
  },
  (optionsInventories) => {
    return {
      pk: primaryKey({
        name: 'options_inventories_pkey',
        columns: [
          optionsInventories.environment,
          optionsInventories.beeswaxListId,
          optionsInventories.name,
          optionsInventories.listName,
        ],
      }),
    };
  },
);

// Schemas

export const SelectOptionsInventoriesSchema =
  createSelectSchema(optionsInventories);

export const OptionsInventoriesModel = getTableColumns(optionsInventories);

export const InsertOptionsInventoriesSchema =
  createInsertSchema(optionsInventories);

// Types

export type OptionsInventories = z.infer<typeof SelectOptionsInventoriesSchema>;
