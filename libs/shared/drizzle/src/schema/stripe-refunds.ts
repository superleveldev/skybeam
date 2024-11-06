import { type Stripe } from 'stripe';
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const stripeRefunds = pgTable('stripe_refunds', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(),
  object: varchar('object', { length: 256 }).$type<Stripe.Refund['object']>(),
  amount: integer('amount').$type<Stripe.Refund['amount']>(),
  balanceTransaction: varchar('balance_transaction', { length: 256 }).$type<
    Stripe.Refund['balance_transaction']
  >(),
  charge: varchar('charge', { length: 256 }).$type<Stripe.Refund['charge']>(),
  currency: varchar('currency', { length: 256 }).$type<
    Stripe.Refund['currency']
  >(),
  description: text('description').$type<Stripe.Refund['description']>(),
  destinationDetails: jsonb('destination_details').$type<
    Stripe.Refund['destination_details']
  >(),
  failureBalanceTransaction: varchar('failure_balance_transaction', {
    length: 256,
  }).$type<Stripe.Refund['failure_balance_transaction']>(),
  failureReason: varchar('failure_reason', { length: 256 }).$type<
    Stripe.Refund['failure_reason']
  >(),
  instructionsEmail: varchar('instructions_email', { length: 256 }).$type<
    Stripe.Refund['instructions_email']
  >(),
  metadata: jsonb('metadata').$type<Stripe.Refund['metadata']>(),
  nextAction: jsonb('next_action').$type<Stripe.Refund['next_action']>(),
  paymentIntent: varchar('payment_intent', { length: 256 }).$type<
    Stripe.Refund['payment_intent']
  >(),
  reason: varchar('reason', { length: 256 }).$type<Stripe.Refund['reason']>(),
  receiptNumber: varchar('receipt_number', { length: 256 }).$type<
    Stripe.Refund['receipt_number']
  >(),
  sourceTransferReversal: varchar('source_transfer_reversal', {
    length: 256,
  }).$type<Stripe.Refund['source_transfer_reversal']>(),
  status: varchar('status', { length: 256 }).$type<Stripe.Refund['status']>(),
  transferReversal: varchar('transfer_reversal', { length: 256 }).$type<
    Stripe.Refund['transfer_reversal']
  >(),
  createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
