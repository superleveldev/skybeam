import { inngest } from '../../client';
import { db } from '../../../server/db';
import { stripePaymentIntents } from '@limelight/shared-drizzle';
import { type Stripe } from 'stripe';

const mapToDbRecord = (
  item: Stripe.PaymentIntent,
): Omit<
  typeof stripePaymentIntents.$inferSelect,
  'updatedAt' | 'deletedAt'
> => {
  return {
    id: item.id,
    amount: item.amount,
    object: item.object,
    amountCapturable: item.amount_capturable,
    amountDetails: item.amount_details,
    amountReceived: item.amount_received,
    application: item.application,
    applicationFeeAmount: item.application_fee_amount,
    automaticPaymentMethods: item.automatic_payment_methods,
    cancellationReason: item.cancellation_reason,
    clientSecret: item.client_secret,
    confirmationMethod: item.confirmation_method,
    currency: item.currency,
    customer: item.customer,
    description: item.description,
    invoice: item.invoice,
    lastPaymentError: item.last_payment_error,
    latestCharge: item.latest_charge,
    livemode: item.livemode,
    metadata: item.metadata,
    nextAction: item.next_action,
    onBehalfOf: item.on_behalf_of,
    paymentMethod: item.payment_method,
    paymentMethodConfigurationDetails:
      item.payment_method_configuration_details,
    paymentMethodOptions: item.payment_method_options,
    paymentMethodTypes: item.payment_method_types,
    processing: item.processing,
    receiptEmail: item.receipt_email,
    review: item.review,
    setupFutureUsage: item.setup_future_usage,
    shipping: item.shipping,
    statementDescriptor: item.statement_descriptor,
    statementDescriptorSuffix: item.statement_descriptor_suffix,
    status: item.status,
    transferData: item.transfer_data,
    transferGroup: item.transfer_group,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
    canceledAt: item.canceled_at ? new Date(item.canceled_at * 1000) : null,
  };
};
// TODO: fix dates from 1970, probably needs * 1000?
export const stripePaymentIntentCreated = inngest.createFunction(
  { id: 'stripe-payment-intent-created' },
  { event: 'stripe/payment_intent.created' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const stripePaymentIntentCanceled = inngest.createFunction(
  { id: 'stripe-payment-intent-canceled' },
  { event: 'stripe/payment_intent.canceled' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const stripePaymentIntentPartiallyFunded = inngest.createFunction(
  { id: 'stripe-payment-intent-partially-funded' },
  { event: 'stripe/payment_intent.partially_funded' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const stripePaymentIntentPaymentFailed = inngest.createFunction(
  { id: 'stripe-payment-intent-payment-failed' },
  { event: 'stripe/payment_intent.payment_failed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const stripePaymentIntentProcessing = inngest.createFunction(
  { id: 'stripe-payment-intent-processing' },
  { event: 'stripe/payment_intent.processing' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const stripePaymentIntentRequiresAction = inngest.createFunction(
  { id: 'stripe-payment-intent-requires-action' },
  { event: 'stripe/payment_intent.requires_action' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const stripePaymentIntentSucceeded = inngest.createFunction(
  { id: 'stripe-payment-intent-succeeded' },
  { event: 'stripe/payment_intent.succeeded' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripePaymentIntents).values(payload).onConflictDoUpdate({
        target: stripePaymentIntents.id,
        set: payload,
      });
    });
  },
);

export const paymentIntentEvents = [
  stripePaymentIntentCreated,
  stripePaymentIntentCanceled,
  stripePaymentIntentPartiallyFunded,
  stripePaymentIntentPaymentFailed,
  stripePaymentIntentProcessing,
  stripePaymentIntentRequiresAction,
  stripePaymentIntentSucceeded,
];
