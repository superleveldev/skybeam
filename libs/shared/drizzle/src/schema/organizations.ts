import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';
import { stripeCustomers } from './stripe-customers';

export const organizations = pgTable('organizations', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'org_29w9IfBrPmcpi0IeBVaKtA7R94W'
  // id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(), //'org_29w9IfBrPmcpi0IeBVaKtA7R94W'
  createdBy: varchar('created_by', { length: 256 }), //'user_1vq84bqWzw7qmFgqSwN4CH1Wp0n'
  imageUrl: text('image_url'), //'https://img.clerk.com/xxxxxx',
  logoUrl: text('logo_url'), //'https://example.org/example.png',
  manualPlanLevel: varchar('manual_plan_level', { length: 256 }),
  name: varchar('name', { length: 256 }), //'Acme Inc',
  // public_metadata: {},
  slug: varchar('slug', { length: 256 }), //'acme-inc',
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  lastIntegrationsRefreshAt: timestamp('last_integrations_refresh_at', {
    withTimezone: true,
  }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const organizationRelations = relations(
  organizations,
  ({ many, one }) => ({
    members: many(users),
    stripeCustomer: one(stripeCustomers, {
      fields: [organizations.stripeCustomerId],
      references: [stripeCustomers.id],
    }),
  }),
);
