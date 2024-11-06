import { getTableColumns } from 'drizzle-orm';
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums

export const httpMethodEnum = pgEnum('http_method', [
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'GET',
]);
export const dspEnum = pgEnum('dsp', ['beeswax', 'bidder']);

// Tables

export const auditCampaigns = pgTable('audit_campaigns', {
  id: uuid('id').notNull(),
  requestBody: jsonb('request_body').notNull(),
  responseBody: jsonb('response_body').notNull(),
  statusCode: integer('status_code').notNull(),
  httpMethod: httpMethodEnum('http_method').notNull(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  operationTime: timestamp('operation_time', { withTimezone: true })
    .notNull()
    .defaultNow(),
  dsp: dspEnum('dsp').notNull(),
});

// Schemas

export const SelectAuditCampaignSchema = createSelectSchema(auditCampaigns);

export const AuditCampaignModel = getTableColumns(auditCampaigns);

export const InsertAuditCampaignSchema = createInsertSchema(auditCampaigns);

// Types

export type AuditCampaign = z.infer<typeof SelectAuditCampaignSchema>;
