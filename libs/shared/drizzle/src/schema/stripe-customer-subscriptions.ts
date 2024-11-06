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

export const stripeCustomerSubscriptions = pgTable(
  'stripe_customer_subscriptions',
  {
    id: varchar('id', { length: 256 }).primaryKey().notNull(),
    object: varchar('object', { length: 256 }).$type<
      Stripe.Subscription['object']
    >(),
    application: varchar('application', { length: 256 }).$type<
      Stripe.Subscription['application']
    >(),
    applicationFeePercent: integer('application_fee_percent').$type<
      Stripe.Subscription['application_fee_percent']
    >(),
    automaticTax:
      jsonb('automatic_tax').$type<Stripe.Subscription['automatic_tax']>(),
    billingCycleAnchor: integer('billing_cycle_anchor').$type<
      Stripe.Subscription['billing_cycle_anchor']
    >(),
    billingCycleAnchorConfig: jsonb('billing_cycle_anchor_config').$type<
      Stripe.Subscription['billing_cycle_anchor_config']
    >(),
    billingThresholds:
      jsonb('billing_thresholds').$type<
        Stripe.Subscription['billing_thresholds']
      >(),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').$type<
      Stripe.Subscription['cancel_at_period_end']
    >(),
    cancellationDetails: jsonb('cancellation_details').$type<
      Stripe.Subscription['cancellation_details']
    >(),
    collectionMethod: varchar('collection_method', { length: 256 }).$type<
      Stripe.Subscription['collection_method']
    >(),
    currency: varchar('currency', { length: 256 }).$type<
      Stripe.Subscription['currency']
    >(),
    customer: varchar('customer', { length: 256 }).$type<
      Stripe.Subscription['customer']
    >(),
    daysUntilDue:
      integer('days_until_due').$type<Stripe.Subscription['days_until_due']>(),
    defaultPaymentMethod: varchar('default_payment_method', {
      length: 256,
    }).$type<Stripe.Subscription['default_payment_method']>(),
    defaultSource: varchar('default_source', { length: 256 }).$type<
      Stripe.Subscription['default_source']
    >(),
    defaultTaxRates:
      jsonb('default_tax_rates').$type<
        Stripe.Subscription['default_tax_rates']
      >(),
    description:
      text('description').$type<Stripe.Subscription['description']>(),
    discount: jsonb('discount').$type<Stripe.Subscription['discount']>(),
    discounts: jsonb('discounts').$type<Stripe.Subscription['discounts']>(),
    items: jsonb('items').$type<Stripe.Subscription['items']>(),
    latestInvoice: varchar('latest_invoice', { length: 256 }).$type<
      Stripe.Subscription['latest_invoice']
    >(),
    livemode: boolean('livemode').$type<Stripe.Subscription['livemode']>(),
    metadata: jsonb('metadata').$type<Stripe.Subscription['metadata']>(),
    onBehalfOf: varchar('on_behalf_of', { length: 256 }).$type<
      Stripe.Subscription['on_behalf_of']
    >(),
    pauseCollection:
      jsonb('pause_collection').$type<
        Stripe.Subscription['pause_collection']
      >(),
    paymentSettings:
      jsonb('payment_settings').$type<
        Stripe.Subscription['payment_settings']
      >(),
    pendingInvoiceItemInterval: jsonb('pending_invoice_item_interval').$type<
      Stripe.Subscription['pending_invoice_item_interval']
    >(),
    pendingSetupIntent: varchar('pending_setup_intent', { length: 256 }).$type<
      Stripe.Subscription['pending_setup_intent']
    >(),
    pendingUpdate:
      jsonb('pending_update').$type<Stripe.Subscription['pending_update']>(),
    schedule: varchar('schedule', { length: 256 }).$type<
      Stripe.Subscription['schedule']
    >(),
    status: varchar('status', { length: 256 }).$type<
      Stripe.Subscription['status']
    >(),
    testClock: varchar('test_clock', { length: 256 }).$type<
      Stripe.Subscription['test_clock']
    >(),
    transferData:
      jsonb('transfer_data').$type<Stripe.Subscription['transfer_data']>(),
    trialSettings:
      jsonb('trial_settings').$type<Stripe.Subscription['trial_settings']>(),
    cancelAt: timestamp('cancel_at', { withTimezone: true }),
    canceledAt: timestamp('canceled_at', { withTimezone: true }),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    currentPeriodStart: timestamp('current_period_start', {
      withTimezone: true,
    }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    nextPendingInvoiceItemInvoice: timestamp(
      'next_pending_invoice_item_invoice',
      { withTimezone: true },
    ),
    startDate: timestamp('start_date', { withTimezone: true }),
    trialEnd: timestamp('trial_end', { withTimezone: true }),
    trialStart: timestamp('trial_start', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix e, {withTimezone:truepoch
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
);
