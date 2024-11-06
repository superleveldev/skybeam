import { type Stripe } from 'stripe';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns';

export const stripeInvoices = pgTable('stripe_invoices', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'sms_abcd',
  object: varchar('object', { length: 256 }).$type<Stripe.Invoice['object']>(),
  accountCountry: varchar('account_country', { length: 256 }).$type<
    Stripe.Invoice['account_country']
  >(),
  accountName: varchar('account_name', { length: 256 }).$type<
    Stripe.Invoice['account_name']
  >(),
  accountTaxIds:
    jsonb('account_tax_ids').$type<Stripe.Invoice['account_tax_ids']>(),
  amountDue: integer('amount_due').$type<Stripe.Invoice['amount_due']>(),
  amountPaid: integer('amount_paid').$type<Stripe.Invoice['amount_paid']>(),
  amountRemaining:
    integer('amount_remaining').$type<Stripe.Invoice['amount_remaining']>(),
  amountShipping:
    integer('amount_shipping').$type<Stripe.Invoice['amount_shipping']>(),
  application: varchar('application', { length: 256 }).$type<
    Stripe.Invoice['application']
  >(),
  applicationFeeAmount: integer('application_fee_amount').$type<
    Stripe.Invoice['application_fee_amount']
  >(),
  attemptCount:
    integer('attempt_count').$type<Stripe.Invoice['attempt_count']>(),
  attempted: boolean('attempted').$type<Stripe.Invoice['attempted']>(),
  autoAdvance: boolean('auto_advance').$type<Stripe.Invoice['auto_advance']>(),
  automaticTax: jsonb('automatic_tax').$type<Stripe.Invoice['automatic_tax']>(),
  billingReason: varchar('billing_reason', { length: 256 }).$type<
    Stripe.Invoice['billing_reason']
  >(),
  charge: varchar('charge', { length: 256 }).$type<Stripe.Invoice['charge']>(),
  collectionMethod: varchar('collection_method', { length: 256 }).$type<
    Stripe.Invoice['collection_method']
  >(),
  currency: varchar('currency', { length: 256 }).$type<
    Stripe.Invoice['currency']
  >(),
  customFields: jsonb('custom_fields').$type<Stripe.Invoice['custom_fields']>(),
  customer: varchar('customer', { length: 256 }).$type<
    Stripe.Invoice['customer']
  >(),
  customerAddress:
    text('customer_address').$type<Stripe.Invoice['customer_address']>(),
  customerEmail: varchar('customer_email', { length: 256 }).$type<
    Stripe.Invoice['customer_email']
  >(),
  customerName: varchar('customer_name', { length: 256 }).$type<
    Stripe.Invoice['customer_name']
  >(),
  customerPhone: varchar('customer_phone', { length: 256 }).$type<
    Stripe.Invoice['customer_phone']
  >(),
  customerShipping:
    jsonb('customer_shipping').$type<Stripe.Invoice['customer_shipping']>(),
  customerTaxExempt: varchar('customer_tax_exempt', { length: 256 }).$type<
    Stripe.Invoice['customer_tax_exempt']
  >(),
  customerTaxIds:
    jsonb('customer_tax_ids').$type<Stripe.Invoice['customer_tax_ids']>(),
  defaultPaymentMethod: varchar('default_payment_method', {
    length: 256,
  }).$type<Stripe.Invoice['default_payment_method']>(),
  defaultSource: varchar('default_source', { length: 256 }).$type<
    Stripe.Invoice['default_source']
  >(),
  defaultTaxRates:
    jsonb('default_tax_rates').$type<Stripe.Invoice['default_tax_rates']>(),
  deleted: boolean('deleted').$type<Stripe.Invoice['deleted']>(),
  description: text('description').$type<Stripe.Invoice['description']>(),
  discount: jsonb('discount').$type<Stripe.Invoice['discount']>(),
  discounts: jsonb('discounts').$type<Stripe.Invoice['discounts']>(),
  endingBalance:
    integer('ending_balance').$type<Stripe.Invoice['ending_balance']>(),
  footer: text('footer').$type<Stripe.Invoice['footer']>(),
  fromInvoice: jsonb('from_invoice').$type<Stripe.Invoice['from_invoice']>(),
  hostedInvoiceUrl:
    text('hosted_invoice_url').$type<Stripe.Invoice['hosted_invoice_url']>(),
  invoicePdf: text('invoice_pdf').$type<Stripe.Invoice['invoice_pdf']>(),
  issuer: jsonb('issuer').$type<Stripe.Invoice['issuer']>(),
  lastFinalizationError: jsonb('last_finalization_error').$type<
    Stripe.Invoice['last_finalization_error']
  >(),
  latestRevision: varchar('latest_revision', { length: 256 }).$type<
    Stripe.Invoice['latest_revision']
  >(),
  lines: jsonb('lines').$type<Stripe.Invoice['lines']>(),
  livemode: boolean('livemode').$type<Stripe.Invoice['livemode']>(),
  metadata: jsonb('metadata').$type<Stripe.Invoice['metadata']>(),
  number: varchar('number', { length: 256 }).$type<Stripe.Invoice['number']>(),
  onBehalfOf: varchar('on_behalf_of', { length: 256 }).$type<
    Stripe.Invoice['on_behalf_of']
  >(),
  paid: boolean('paid').$type<Stripe.Invoice['paid']>(),
  paidOutOfBand:
    boolean('paid_out_of_band').$type<Stripe.Invoice['paid_out_of_band']>(),
  paymentIntent: varchar('payment_intent', { length: 256 }).$type<
    Stripe.Invoice['payment_intent']
  >(),
  paymentSettings:
    jsonb('payment_settings').$type<Stripe.Invoice['payment_settings']>(),
  postPaymentCreditNotesAmount: integer(
    'post_payment_credit_notes_amount',
  ).$type<Stripe.Invoice['post_payment_credit_notes_amount']>(),
  prePaymentCreditNotesAmount: integer('pre_payment_credit_notes_amount').$type<
    Stripe.Invoice['pre_payment_credit_notes_amount']
  >(),
  quote: varchar('quote', { length: 256 }).$type<Stripe.Invoice['quote']>(),
  receiptNumber: varchar('receipt_number', { length: 256 }).$type<
    Stripe.Invoice['receipt_number']
  >(),
  rendering: jsonb('rendering').$type<Stripe.Invoice['rendering']>(),
  shippingCost: jsonb('shipping_cost').$type<Stripe.Invoice['shipping_cost']>(),
  shippingDetails:
    jsonb('shipping_details').$type<Stripe.Invoice['shipping_details']>(),
  startingBalance:
    integer('starting_balance').$type<Stripe.Invoice['starting_balance']>(),
  statementDescriptor: text('statement_descriptor').$type<
    Stripe.Invoice['statement_descriptor']
  >(),
  status: varchar('status', { length: 256 }).$type<Stripe.Invoice['status']>(),
  statusTransitions:
    jsonb('status_transitions').$type<Stripe.Invoice['status_transitions']>(),
  subscription: varchar('subscription', { length: 256 }).$type<
    Stripe.Invoice['subscription']
  >(),
  subscriptionDetails: jsonb('subscription_details').$type<
    Stripe.Invoice['subscription_details']
  >(),
  subtotal: integer('subtotal').$type<Stripe.Invoice['subtotal']>(),
  subtotalExcludingTax: integer('subtotal_excluding_tax').$type<
    Stripe.Invoice['subtotal_excluding_tax']
  >(),
  tax: integer('tax').$type<Stripe.Invoice['tax']>(),
  testClock: varchar('test_clock', { length: 256 }).$type<
    Stripe.Invoice['test_clock']
  >(),
  thresholdReason:
    jsonb('threshold_reason').$type<Stripe.Invoice['threshold_reason']>(),
  total: integer('total').$type<Stripe.Invoice['total']>(),
  totalDiscountAmounts: jsonb('total_discount_amounts').$type<
    Stripe.Invoice['total_discount_amounts']
  >(),
  totalExcludingTax: integer('total_excluding_tax').$type<
    Stripe.Invoice['total_excluding_tax']
  >(),
  totalTaxAmounts:
    jsonb('total_tax_amounts').$type<Stripe.Invoice['total_tax_amounts']>(),
  transferData: jsonb('transfer_data').$type<Stripe.Invoice['transfer_data']>(),
  subscriptionProrationDate: timestamp('subscription_proration_date', {
    withTimezone: true,
  }),
  nextPaymentAttempt: timestamp('next_payment_attempt', { withTimezone: true }),
  webhooksDeliveredAt: timestamp('webhooks_delivered_at', {
    withTimezone: true,
  }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  periodStart: timestamp('period_start', { withTimezone: true }),
  dueDate: timestamp('due_date', { withTimezone: true }), // raw is seconds since the Unix epoch
  effectiveAt: timestamp('effective_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  campaignId: uuid('campaign_id'),
});

export const stripeInvoicesRelations = relations(stripeInvoices, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [stripeInvoices.campaignId],
    references: [campaigns.id],
  }),
}));
