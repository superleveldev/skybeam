import { pgTable, uuid, text, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { advertisers } from './advertisers';

// --------------------------------------------------
// Enums
// --------------------------------------------------

export const envEnum = pgEnum('envEnum', ['production', 'development']);

// --------------------------------------------------
// Table
// --------------------------------------------------

export const advertiserPixels = pgTable('advertiser_pixels', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  pixelId: uuid('pixel_id').notNull(),
  advertiserId: uuid('advertiser_id').references(() => advertisers.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  name: text('name'),
  environment: envEnum('environment').default('production'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const pixelRelations = relations(advertiserPixels, ({ one }) => ({
  advertiser: one(advertisers, {
    fields: [advertiserPixels.advertiserId],
    references: [advertisers.id],
  }),
}));

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const selectPixelSchema = createSelectSchema(advertiserPixels);

// --------------------------------------------------
// Types
// --------------------------------------------------

export type Pixel = z.infer<typeof selectPixelSchema>;
