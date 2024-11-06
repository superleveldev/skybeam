import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { campaigns, beeswaxSyncEnum } from './campaigns';
import { organizations } from './organizations';
import { advertiserPixels } from './pixel';

const ACCEPTED_IMAGE_FORMATS = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 4000000; // 4MB

// Enums

export const industryEnum = pgEnum('industry', [
  'Arts & Entertainment',
  'Automotive',
  'Business',
  'Careers',
  'Education',
  'Family & Parenting',
  'Health & Fitness',
  'Food & Drink',
  'Hobbies & Interests',
  'Home & Garden',
  'Law, Government & Politics',
  'News, Weather & Information',
  'Personal Finance',
  'Society',
  'Science',
  'Pets',
  'Sports',
  'Style & Fashion',
  'Technology & Computing',
  'Travel',
  'Real Estate',
  'Shopping',
  'Religion & Spirituality',
  'Uncategorized',
  'Other',
]);

// Tables

export const advertisers = pgTable(
  'advertisers',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    clerkOrganizationId: text('clerk_organization_id').notNull(),
    website: text('website').notNull().unique(),
    industry: industryEnum('industry').notNull().default('Uncategorized'),
    logoUrl: text('logo_url'),
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
    unq: unique('advertiser_name').on(t.clerkOrganizationId, t.name),
    orgIdx: index('org_idx').on(t.clerkOrganizationId),
  }),
);

export const advertisersRelations = relations(advertisers, ({ many, one }) => ({
  campaigns: many(campaigns),
  pixels: many(advertiserPixels),
  organization: one(organizations, {
    fields: [advertisers.clerkOrganizationId],
    references: [organizations.id],
  }),
}));

// Schemas

export const selectAdvertiserSchema = createSelectSchema(advertisers);

export const InsertAdvertiserSchema = createInsertSchema(advertisers, {
  name: (schema) =>
    schema.name
      .min(1, "Name can't be empty")
      .max(255, 'Name must be less than 255 characters'),
  website: (schema) =>
    schema.name
      .min(1, "Website can't be empty")
      .max(255, 'Website must be less than 255 characters')
      .regex(
        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
        'Invalid URL',
      ),
  industry: (schema) => schema.industry,
}).omit({ clerkOrganizationId: true });

// Types

export type Advertiser = z.infer<typeof selectAdvertiserSchema>;
export type FormAdvertiser = z.infer<typeof InsertAdvertiserSchema>;

export const AdvertiserLogoSchema = z.object({
  logo: z
    .any()
    .refine((file) => file?.type, 'Please supply a file.')
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE && file?.size > 0,
      'Max file size is 4 MB.',
    )
    .refine(
      (file) => ACCEPTED_IMAGE_FORMATS.includes(file?.type),
      'Only JPEG or PNG files are supported.',
    ),
});
