import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { advertisers } from './advertisers';
import { targetingGroupCreatives } from './targeting-group-creatives';

const MAX_FILE_SIZE = 5000000000; // 5GB
const ACCEPTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime'];

export const creatives = pgTable(
  'creatives',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    advertiserId: uuid('advertiser_id')
      .notNull()
      .references(() => advertisers.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    name: text('name').notNull(),
    filePath: text('file_path'),
    transcodedPath: text('transcoded_path'),
    previewUrl: text('preview_url'),
    durationMS: integer('duration_ms'),
    resolutionWidth: integer('resolution_width'),
    resolutionHeight: integer('resolution_height'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unq: unique('creatives_name_key').on(t.advertiserId, t.name),
  }),
);

export const creativesRelations = relations(creatives, ({ many, one }) => ({
  advertiser: one(advertisers, {
    fields: [creatives.advertiserId],
    references: [advertisers.id],
  }),
  targetingGroupCreatives: many(targetingGroupCreatives),
}));

export const SelectCreativesSchema = createSelectSchema(creatives);
export const InsertCreativesSchema = createInsertSchema(creatives, {
  name: (schema) =>
    schema.name
      .min(1, "Name can't be empty")
      .max(255, 'Name must be less than 255 characters'),
});
export const UpdateCreativesSchema = z.object({
  id: z.string().uuid().min(1),
  name: z.string().optional(),
  filePath: z.string().optional(),
  transcodedPath: z.string().optional(),
});

export type Creative = z.infer<typeof SelectCreativesSchema>;
export type FormCreative = z.infer<typeof InsertCreativesSchema>;

export const UploadCreativeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name can't be empty")
    .max(255, 'Name must be less than 255 characters'),
  file: z
    .any()
    .refine((file) => file?.type, 'Please supply a file.')
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE && file?.size > 0,
      'Max video size is 5 GB.',
    )
    .refine(
      (file) => ACCEPTED_VIDEO_FORMATS.includes(file?.type),
      'Only MP4 or MOV files are supported.',
    ),
});
