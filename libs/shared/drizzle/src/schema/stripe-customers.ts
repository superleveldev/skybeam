import { type Stripe } from 'stripe';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { stripeCustomerSubscriptions } from './stripe-customer-subscriptions';

export const stripeCustomers = pgTable('stripe_customers', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(),
  object: varchar('object', { length: 256 }).$type<Stripe.Customer['object']>(),
  address: jsonb('address').$type<Stripe.Customer['address']>(),
  balance: integer('balance').$type<Stripe.Customer['balance']>(),
  cashBalance: jsonb('cash_balance').$type<Stripe.Customer['cash_balance']>(),
  currency: varchar('currency', { length: 256 }).$type<
    Stripe.Customer['currency']
  >(),
  defaultSource: varchar('default_source', { length: 256 }).$type<
    Stripe.Customer['default_source']
  >(),
  deleted: boolean('deleted').$type<Stripe.Customer['deleted']>(),
  delinquent: boolean('delinquent').$type<Stripe.Customer['delinquent']>(),
  description: text('description').$type<Stripe.Customer['description']>(),
  discount: jsonb('discount').$type<Stripe.Customer['discount']>(),
  email: varchar('email', { length: 256 }).$type<Stripe.Customer['email']>(),
  invoiceCreditBalance: jsonb('invoice_credit_balance').$type<
    Stripe.Customer['invoice_credit_balance']
  >(),
  invoicePrefix: varchar('invoice_prefix', { length: 256 }).$type<
    Stripe.Customer['invoice_prefix']
  >(),
  invoiceSettings:
    jsonb('invoice_settings').$type<Stripe.Customer['invoice_settings']>(),
  livemode: boolean('livemode').$type<Stripe.Customer['livemode']>(),
  metadata: jsonb('metadata').$type<Stripe.Customer['metadata']>(),
  name: varchar('name', { length: 256 }).$type<Stripe.Customer['name']>(),
  nextInvoiceSequence: integer('next_invoice_sequence').$type<
    Stripe.Customer['next_invoice_sequence']
  >(),
  phone: varchar('phone', { length: 256 }).$type<Stripe.Customer['phone']>(),
  preferredLocales:
    jsonb('preferred_locales').$type<Stripe.Customer['preferred_locales']>(),
  shipping: jsonb('shipping').$type<Stripe.Customer['shipping']>(),
  sources: jsonb('sources').$type<Stripe.Customer['sources']>(),
  subscriptions:
    jsonb('subscriptions').$type<Stripe.Customer['subscriptions']>(),
  tax: jsonb('tax').$type<Stripe.Customer['tax']>(),
  taxExempt: varchar('tax_exempt', { length: 256 }).$type<
    Stripe.Customer['tax_exempt']
  >(),
  taxIds: jsonb('tax_ids').$type<Stripe.Customer['tax_ids']>(),
  testClock: varchar('test_clock', { length: 256 }).$type<
    Stripe.Customer['test_clock']
  >(),
  createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const stripeCustomersRelations = relations(
  stripeCustomers,
  ({ many }) => ({
    subscriptions: many(stripeCustomerSubscriptions),
  }),
);
