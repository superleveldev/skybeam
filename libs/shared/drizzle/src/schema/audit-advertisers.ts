import { getTableColumns } from 'drizzle-orm';
import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { httpMethodEnum, dspEnum } from './audit-campaigns';

// Tables

export const auditAdvertisers = pgTable('audit_advertisers', {
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

export const SelectAuditAdvertiserSchema = createSelectSchema(auditAdvertisers);

export const AuditAdvertiserModel = getTableColumns(auditAdvertisers);

export const InsertAuditAdvertiserSchema = createInsertSchema(auditAdvertisers);

// Types

export type AuditAdvertiser = z.infer<typeof SelectAuditAdvertiserSchema>;
