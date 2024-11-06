import { type Stripe } from 'stripe';

type StripeWebhookReceived<T> = {
  data: { payload: T; signature: string };
};

type StripeEvents = {
  'stripe/webhook.received': StripeWebhookReceived<Stripe.Event>;
  'stripe/charge.captured': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.captured' }>
  >;
  'stripe/charge.expired': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.expired' }>
  >;
  'stripe/charge.failed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.failed' }>
  >;
  'stripe/charge.pending': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.pending' }>
  >;
  'stripe/charge.refunded': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.refunded' }>
  >;
  'stripe/charge.succeeded': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.succeeded' }>
  >;
  'stripe/charge.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'charge.updated' }>
  >;
  'stripe/checkout.session.async_payment_failed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'checkout.session.async_payment_failed' }>
  >;
  'stripe/checkout.session.async_payment_succeeded': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'checkout.session.async_payment_succeeded' }>
  >;
  'stripe/checkout.session.completed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'checkout.session.completed' }>
  >;
  'stripe/checkout.session.expired': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'checkout.session.expired' }>
  >;
  'stripe/customer.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.created' }>
  >;
  'stripe/customer.deleted': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.deleted' }>
  >;
  'stripe/customer.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.updated' }>
  >;
  'stripe/customer.subscription.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.subscription.created' }>
  >;
  'stripe/customer.subscription.deleted': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.subscription.deleted' }>
  >;
  'stripe/customer.subscription.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.subscription.updated' }>
  >;
  'stripe/customer.subscription.paused': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.subscription.paused' }>
  >;
  'stripe/customer.subscription.pending_update_applied': StripeWebhookReceived<
    Extract<
      Stripe.Event,
      { type: 'customer.subscription.pending_update_applied' }
    >
  >;
  'stripe/customer.subscription.pending_update_expired': StripeWebhookReceived<
    Extract<
      Stripe.Event,
      { type: 'customer.subscription.pending_update_expired' }
    >
  >;
  'stripe/customer.subscription.resumed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'customer.subscription.resumed' }>
  >;
  'stripe/invoice.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.created' }>
  >;
  'stripe/invoice.deleted': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.deleted' }>
  >;
  'stripe/invoice.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.updated' }>
  >;
  'stripe/invoice.finalization_failed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.finalization_failed' }>
  >;
  'stripe/invoice.finalized': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.finalized' }>
  >;
  'stripe/invoice.marked_uncollectible': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.marked_uncollectible' }>
  >;
  'stripe/invoice.paid': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.paid' }>
  >;
  'stripe/invoice.payment_action_required': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.payment_action_required' }>
  >;
  'stripe/invoice.payment_failed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.payment_failed' }>
  >;
  'stripe/invoice.payment_succeeded': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.payment_succeeded' }>
  >;
  'stripe/invoice.sent': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.sent' }>
  >;
  'stripe/invoice.upcoming': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.upcoming' }>
  >;
  'stripe/invoice.voided': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'invoice.voided' }>
  >;
  'stripe/payment_intent.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.created' }>
  >;
  'stripe/payment_intent.canceled': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.canceled' }>
  >;
  'stripe/payment_intent.partially_funded': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.partially_funded' }>
  >;
  'stripe/payment_intent.payment_failed': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.payment_failed' }>
  >;
  'stripe/payment_intent.processing': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.processing' }>
  >;
  'stripe/payment_intent.requires_action': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.requires_action' }>
  >;
  'stripe/payment_intent.succeeded': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_intent.succeeded' }>
  >;
  'stripe/payment_link.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_link.created' }>
  >;
  'stripe/payment_link.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'payment_link.updated' }>
  >;
  'stripe/person.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'person.created' }>
  >;
  'stripe/person.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'person.updated' }>
  >;
  'stripe/person.deleted': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'person.deleted' }>
  >;
  'stripe/refund.created': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'refund.created' }>
  >;
  'stripe/refund.updated': StripeWebhookReceived<
    Extract<Stripe.Event, { type: 'refund.updated' }>
  >;
};

export { type StripeEvents };
