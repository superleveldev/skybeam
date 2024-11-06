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

export const stripeCharges = pgTable('stripe_charges', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(),
  object: varchar('object', { length: 256 }).$type<Stripe.Charge['object']>(),
  amount: integer('amount').$type<Stripe.Charge['amount']>(),
  amountCaptured:
    integer('amount_captured').$type<Stripe.Charge['amount_captured']>(),
  amountRefunded:
    integer('amount_refunded').$type<Stripe.Charge['amount_refunded']>(),
  application: varchar('application', { length: 256 }).$type<
    Stripe.Charge['application']
  >(),
  applicationFee: varchar('application_fee', { length: 256 }).$type<
    Stripe.Charge['application_fee']
  >(),
  applicationFeeAmount: integer('application_fee_amount').$type<
    Stripe.Charge['application_fee_amount']
  >(),
  authorizationCode: varchar('authorization_code', { length: 256 }).$type<
    Stripe.Charge['authorization_code']
  >(),
  balanceTransaction: varchar('balance_transaction', { length: 256 }).$type<
    Stripe.Charge['balance_transaction']
  >(),
  billingDetails:
    jsonb('billing_details').$type<Stripe.Charge['billing_details']>(),
  calculatedStatementDescriptor: text('calculated_statement_descriptor').$type<
    Stripe.Charge['calculated_statement_descriptor']
  >(),
  captured: boolean('captured').$type<Stripe.Charge['captured']>(),
  currency: varchar('currency', { length: 256 }).$type<
    Stripe.Charge['currency']
  >(),
  customer: varchar('customer', { length: 256 }).$type<
    Stripe.Charge['customer']
  >(),
  description: text('description').$type<Stripe.Charge['description']>(),
  disputed: boolean('disputed').$type<Stripe.Charge['disputed']>(),
  failureBalanceTransaction: varchar('failure_balance_transaction', {
    length: 256,
  }).$type<Stripe.Charge['failure_balance_transaction']>(),
  failureCode: varchar('failure_code', { length: 256 }).$type<
    Stripe.Charge['failure_code']
  >(),
  failureMessage:
    text('failure_message').$type<Stripe.Charge['failure_message']>(),
  fraudDetails: jsonb('fraud_details').$type<Stripe.Charge['fraud_details']>(),
  invoice: varchar('invoice', { length: 256 }).$type<
    Stripe.Charge['invoice']
  >(),
  level3: jsonb('level3').$type<Stripe.Charge['level3']>(),
  livemode: boolean('livemode').$type<Stripe.Charge['livemode']>(),
  metadata: jsonb('metadata').$type<Stripe.Charge['metadata']>(),
  onBehalfOf: varchar('on_behalf_of', { length: 256 }).$type<
    Stripe.Charge['on_behalf_of']
  >(),
  outcome: jsonb('outcome').$type<Stripe.Charge['outcome']>(),
  paid: boolean('paid').$type<Stripe.Charge['paid']>(),
  paymentIntent: varchar('payment_intent', { length: 256 }).$type<
    Stripe.Charge['payment_intent']
  >(),
  paymentMethod: varchar('payment_method', { length: 256 }).$type<
    Stripe.Charge['payment_method']
  >(),
  paymentMethodDetails: jsonb('payment_method_details').$type<
    Stripe.Charge['payment_method_details']
  >(),
  radarOptions: jsonb('radar_options').$type<Stripe.Charge['radar_options']>(),
  receiptEmail: varchar('receipt_email', { length: 256 }).$type<
    Stripe.Charge['receipt_email']
  >(),
  receiptNumber: varchar('receipt_number', { length: 256 }).$type<
    Stripe.Charge['receipt_number']
  >(),
  receiptUrl: text('receipt_url').$type<Stripe.Charge['receipt_url']>(),
  refunded: boolean('refunded').$type<Stripe.Charge['refunded']>(),
  refunds: jsonb('refunds').$type<Stripe.Charge['refunds']>(),
  review: varchar('review', { length: 256 }).$type<Stripe.Charge['review']>(),
  shipping: jsonb('shipping').$type<Stripe.Charge['shipping']>(),
  sourceTransfer: varchar('source_transfer', { length: 256 }).$type<
    Stripe.Charge['source_transfer']
  >(),
  statementDescriptor: varchar('statement_descriptor', { length: 256 }).$type<
    Stripe.Charge['statement_descriptor']
  >(),
  statementDescriptorSuffix: varchar('statement_descriptor_suffix', {
    length: 256,
  }).$type<Stripe.Charge['statement_descriptor_suffix']>(),
  status: varchar('status', { length: 256 }).$type<Stripe.Charge['status']>(),
  transfer: varchar('transfer', { length: 256 }).$type<
    Stripe.Charge['transfer']
  >(),
  transferData: jsonb('transfer_data').$type<Stripe.Charge['transfer_data']>(),
  transferGroup: varchar('transfer_group', { length: 256 }).$type<
    Stripe.Charge['transfer_group']
  >(),
  createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
