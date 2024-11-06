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

export const stripePaymentIntents = pgTable('stripe_payment_intents', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'sms_abcd',
  amount: integer('amount').$type<Stripe.PaymentIntent['amount']>(),
  object: varchar('object', { length: 256 }).$type<
    Stripe.PaymentIntent['object']
  >(),
  amountCapturable:
    integer('amount_capturable').$type<
      Stripe.PaymentIntent['amount_capturable']
    >(),
  amountDetails:
    jsonb('amount_details').$type<Stripe.PaymentIntent['amount_details']>(),
  amountReceived:
    integer('amount_received').$type<Stripe.PaymentIntent['amount_received']>(),
  application: varchar('application', { length: 256 }).$type<
    Stripe.PaymentIntent['application']
  >(),
  applicationFeeAmount: integer('application_fee_amount').$type<
    Stripe.PaymentIntent['application_fee_amount']
  >(),
  automaticPaymentMethods: jsonb('automatic_payment_methods').$type<
    Stripe.PaymentIntent['automatic_payment_methods']
  >(),
  cancellationReason: varchar('cancellation_reason', { length: 256 }).$type<
    Stripe.PaymentIntent['cancellation_reason']
  >(),
  clientSecret:
    text('client_secret').$type<Stripe.PaymentIntent['client_secret']>(),
  confirmationMethod: varchar('confirmation_method', { length: 256 }).$type<
    Stripe.PaymentIntent['confirmation_method']
  >(),
  currency: varchar('currency', { length: 256 }).$type<
    Stripe.PaymentIntent['currency']
  >(),
  customer: varchar('customer', { length: 256 }).$type<
    Stripe.PaymentIntent['customer']
  >(),
  description: text('description').$type<Stripe.PaymentIntent['description']>(),
  invoice: varchar('invoice', { length: 256 }).$type<
    Stripe.PaymentIntent['invoice']
  >(),
  lastPaymentError:
    text('last_payment_error').$type<
      Stripe.PaymentIntent['last_payment_error']
    >(),
  latestCharge:
    jsonb('latest_charge').$type<Stripe.PaymentIntent['latest_charge']>(),
  livemode: boolean('livemode').$type<Stripe.PaymentIntent['livemode']>(),
  metadata: jsonb('metadata').$type<Stripe.PaymentIntent['metadata']>(),
  nextAction: jsonb('next_action').$type<Stripe.PaymentIntent['next_action']>(),
  onBehalfOf:
    jsonb('on_behalf_of').$type<Stripe.PaymentIntent['on_behalf_of']>(),
  paymentMethod: varchar('payment_method', { length: 256 }).$type<
    Stripe.PaymentIntent['payment_method']
  >(),
  paymentMethodConfigurationDetails: jsonb(
    'payment_method_configuration_details',
  ).$type<Stripe.PaymentIntent['payment_method_configuration_details']>(),
  paymentMethodOptions: jsonb('payment_method_options').$type<
    Stripe.PaymentIntent['payment_method_options']
  >(),
  paymentMethodTypes: jsonb('payment_method_types').$type<
    Stripe.PaymentIntent['payment_method_types']
  >(),
  processing: jsonb('processing').$type<Stripe.PaymentIntent['processing']>(),
  receiptEmail: varchar('receipt_email', { length: 256 }).$type<
    Stripe.PaymentIntent['receipt_email']
  >(),
  review: varchar('review', { length: 256 }).$type<
    Stripe.PaymentIntent['review']
  >(),
  setupFutureUsage: varchar('setup_future_usage', { length: 256 }).$type<
    Stripe.PaymentIntent['setup_future_usage']
  >(),
  shipping: jsonb('shipping').$type<Stripe.PaymentIntent['shipping']>(),
  statementDescriptor: varchar('statement_descriptor', { length: 256 }).$type<
    Stripe.PaymentIntent['statement_descriptor']
  >(),
  statementDescriptorSuffix: varchar('statement_descriptor_suffix', {
    length: 256,
  }).$type<Stripe.PaymentIntent['statement_descriptor_suffix']>(),
  status: varchar('status', { length: 256 }).$type<
    Stripe.PaymentIntent['status']
  >(),
  transferData:
    jsonb('transfer_data').$type<Stripe.PaymentIntent['transfer_data']>(),
  transferGroup: varchar('transfer_group', { length: 256 }).$type<
    Stripe.PaymentIntent['transfer_group']
  >(),
  createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  canceledAt: timestamp('canceled_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
