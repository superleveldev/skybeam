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

export const stripeCheckoutSessions = pgTable('stripe_checkout_sessions', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'sms_abcd',
  object: varchar('object', { length: 256 }).$type<
    Stripe.Checkout.Session['object']
  >(),
  afterExpiration:
    jsonb('after_expiration').$type<
      Stripe.Checkout.Session['after_expiration']
    >(),
  allowPromotionCodes: boolean('allow_promotion_codes').$type<
    Stripe.Checkout.Session['allow_promotion_codes']
  >(),
  amountSubtotal:
    integer('amount_subtotal').$type<
      Stripe.Checkout.Session['amount_subtotal']
    >(),
  amountTotal:
    integer('amount_total').$type<Stripe.Checkout.Session['amount_total']>(),
  automaticTax:
    jsonb('automatic_tax').$type<Stripe.Checkout.Session['automatic_tax']>(),
  billingAddressCollection: varchar('billing_address_collection', {
    length: 256,
  }).$type<Stripe.Checkout.Session['billing_address_collection']>(),
  cancelUrl: text('cancel_url').$type<Stripe.Checkout.Session['cancel_url']>(),
  clientReferenceId: varchar('client_reference_id', { length: 256 }).$type<
    Stripe.Checkout.Session['client_reference_id']
  >(),
  clientSecret:
    text('client_secret').$type<Stripe.Checkout.Session['client_secret']>(),
  consent: jsonb('consent').$type<Stripe.Checkout.Session['consent']>(),
  consentCollection:
    jsonb('consent_collection').$type<
      Stripe.Checkout.Session['consent_collection']
    >(),
  currency: varchar('currency', { length: 256 }).$type<
    Stripe.Checkout.Session['currency']
  >(),
  currencyConversion: jsonb('currency_conversion').$type<
    Stripe.Checkout.Session['currency_conversion']
  >(),
  customFields:
    jsonb('custom_fields').$type<Stripe.Checkout.Session['custom_fields']>(),
  customText:
    jsonb('custom_text').$type<Stripe.Checkout.Session['custom_text']>(),
  customer: varchar('customer', { length: 256 }).$type<
    Stripe.Checkout.Session['customer']
  >(),
  customerCreation: varchar('customer_creation', { length: 256 }).$type<
    Stripe.Checkout.Session['customer_creation']
  >(),
  customerDetails:
    jsonb('customer_details').$type<
      Stripe.Checkout.Session['customer_details']
    >(),
  customerEmail: varchar('customer_email', { length: 256 }).$type<
    Stripe.Checkout.Session['customer_email']
  >(),
  invoice: varchar('invoice', { length: 256 }).$type<
    Stripe.Checkout.Session['invoice']
  >(),
  invoiceCreation:
    jsonb('invoice_creation').$type<
      Stripe.Checkout.Session['invoice_creation']
    >(),
  lineItems: jsonb('line_items').$type<Stripe.Checkout.Session['line_items']>(),
  livemode: boolean('livemode').$type<Stripe.Checkout.Session['livemode']>(),
  locale: varchar('locale', { length: 256 }).$type<
    Stripe.Checkout.Session['locale']
  >(),
  metadata: jsonb('metadata').$type<Stripe.Checkout.Session['metadata']>(),
  mode: varchar('mode', { length: 256 }).$type<
    Stripe.Checkout.Session['mode']
  >(),
  paymentIntent: varchar('payment_intent', { length: 256 }).$type<
    Stripe.Checkout.Session['payment_intent']
  >(),
  paymentLink: varchar('payment_link', { length: 256 }).$type<
    Stripe.Checkout.Session['payment_link']
  >(),
  paymentMethodCollection: varchar('payment_method_collection', {
    length: 256,
  }).$type<Stripe.Checkout.Session['payment_method_collection']>(),
  paymentMethodConfigurationDetails: jsonb(
    'payment_method_configuration_details',
  ).$type<Stripe.Checkout.Session['payment_method_configuration_details']>(),
  paymentMethodOptions: jsonb('payment_method_options').$type<
    Stripe.Checkout.Session['payment_method_options']
  >(),
  paymentMethodTypes: jsonb('payment_method_types').$type<
    Stripe.Checkout.Session['payment_method_types']
  >(),
  paymentStatus: varchar('payment_status', { length: 256 }).$type<
    Stripe.Checkout.Session['payment_status']
  >(),
  phoneNumberCollection: jsonb('phone_number_collection').$type<
    Stripe.Checkout.Session['phone_number_collection']
  >(),
  recoveredFrom: varchar('recovered_from', { length: 256 }).$type<
    Stripe.Checkout.Session['recovered_from']
  >(),
  redirectOnCompletion: varchar('redirect_on_completion', {
    length: 256,
  }).$type<Stripe.Checkout.Session['redirect_on_completion']>(),
  returnUrl: text('return_url').$type<Stripe.Checkout.Session['return_url']>(),
  savedPaymentMethodOptions: jsonb('saved_payment_method_options').$type<
    Stripe.Checkout.Session['saved_payment_method_options']
  >(),
  setupIntent: varchar('setup_intent', { length: 256 }).$type<
    Stripe.Checkout.Session['setup_intent']
  >(),
  shippingAddressCollection: jsonb('shipping_address_collection').$type<
    Stripe.Checkout.Session['shipping_address_collection']
  >(),
  shippingCost:
    jsonb('shipping_cost').$type<Stripe.Checkout.Session['shipping_cost']>(),
  shippingDetails:
    jsonb('shipping_details').$type<
      Stripe.Checkout.Session['shipping_details']
    >(),
  shippingOptions:
    jsonb('shipping_options').$type<
      Stripe.Checkout.Session['shipping_options']
    >(),
  status: varchar('status', { length: 256 }).$type<
    Stripe.Checkout.Session['status']
  >(),
  submitType: varchar('submit_type', { length: 256 }).$type<
    Stripe.Checkout.Session['submit_type']
  >(),
  subscription: varchar('subscription', { length: 256 }).$type<
    Stripe.Checkout.Session['subscription']
  >(),
  successUrl:
    text('success_url').$type<Stripe.Checkout.Session['success_url']>(),
  taxIdCollection:
    jsonb('tax_id_collection').$type<
      Stripe.Checkout.Session['tax_id_collection']
    >(),
  totalDetails:
    jsonb('total_details').$type<Stripe.Checkout.Session['total_details']>(),
  uiMode: varchar('ui_mode', { length: 256 }).$type<
    Stripe.Checkout.Session['ui_mode']
  >(),
  url: text('url').$type<Stripe.Checkout.Session['url']>(),
  createdAt: timestamp('created_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  expiresAt: timestamp('expires_at', { withTimezone: true }), // raw is seconds since the Unix epoch
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
