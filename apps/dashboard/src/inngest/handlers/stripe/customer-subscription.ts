import { inngest } from '../../client';
import { stripeCustomerSubscriptions } from '@limelight/shared-drizzle';
import { db } from '../../../server/db';
import { type Stripe } from 'stripe';

const mapToDbRecord = (
  item: Stripe.Subscription,
): Omit<
  typeof stripeCustomerSubscriptions.$inferSelect,
  'updatedAt' | 'deletedAt'
> => {
  return {
    id: item.id,
    object: item.object,
    application: item.application,
    applicationFeePercent: item.application_fee_percent,
    automaticTax: item.automatic_tax,
    billingCycleAnchor: item.billing_cycle_anchor,
    billingCycleAnchorConfig: item.billing_cycle_anchor_config,
    billingThresholds: item.billing_thresholds,
    cancelAtPeriodEnd: item.cancel_at_period_end,
    cancellationDetails: item.cancellation_details,
    collectionMethod: item.collection_method,
    currency: item.currency,
    customer: item.customer,
    daysUntilDue: item.days_until_due,
    defaultPaymentMethod: item.default_payment_method,
    defaultSource: item.default_source,
    defaultTaxRates: item.default_tax_rates,
    description: item.description,
    discount: item.discount,
    discounts: item.discounts,
    items: item.items,
    latestInvoice: item.latest_invoice,
    livemode: item.livemode,
    metadata: item.metadata,
    onBehalfOf: item.on_behalf_of,
    pauseCollection: item.pause_collection,
    paymentSettings: item.payment_settings,
    pendingInvoiceItemInterval: item.pending_invoice_item_interval,
    pendingSetupIntent: item.pending_setup_intent,
    pendingUpdate: item.pending_update,
    schedule: item.schedule,
    status: item.status,
    testClock: item.test_clock,
    transferData: item.transfer_data,
    trialSettings: item.trial_settings,
    cancelAt: item.cancel_at ? new Date(item.cancel_at * 1000) : null,
    canceledAt: item.canceled_at ? new Date(item.canceled_at * 1000) : null,
    currentPeriodEnd: item.current_period_end
      ? new Date(item.current_period_end * 1000)
      : null,
    currentPeriodStart: item.current_period_start
      ? new Date(item.current_period_start * 1000)
      : null,
    endedAt: item.ended_at ? new Date(item.ended_at * 1000) : null,
    nextPendingInvoiceItemInvoice: item.next_pending_invoice_item_invoice
      ? new Date(item.next_pending_invoice_item_invoice * 1000)
      : null,
    startDate: item.start_date ? new Date(item.start_date * 1000) : null,
    trialStart: item.trial_start ? new Date(item.trial_start * 1000) : null,
    trialEnd: item.trial_end ? new Date(item.trial_end * 1000) : null,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
  };
};

export const stripeCustomerSubscriptionCreated = inngest.createFunction(
  { id: 'stripe-customer-subscription-created' },
  { event: 'stripe/customer.subscription.created' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCustomerSubscriptions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCustomerSubscriptions.id,
          set: payload,
        });
    });
  },
);

export const stripeCustomerSubscriptionDeleted = inngest.createFunction(
  { id: 'stripe-customer-subscription-deleted' },
  { event: 'stripe/customer.subscription.deleted' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCustomerSubscriptions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCustomerSubscriptions.id,
          set: payload,
        });
    });
  },
);

export const stripeCustomerSubscriptionUpdated = inngest.createFunction(
  { id: 'stripe-customer-subscription-updated' },
  { event: 'stripe/customer.subscription.updated' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCustomerSubscriptions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCustomerSubscriptions.id,
          set: payload,
        });
    });
  },
);

export const stripeCustomerSubscriptionPaused = inngest.createFunction(
  { id: 'stripe-customer-subscription-paused' },
  { event: 'stripe/customer.subscription.paused' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCustomerSubscriptions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCustomerSubscriptions.id,
          set: payload,
        });
    });
  },
);

export const stripeCustomerSubscriptionPendingUpdateApplied =
  inngest.createFunction(
    { id: 'stripe-customer-subscription-pending-update-applied' },
    { event: 'stripe/customer.subscription.pending_update_applied' },
    async ({ event, step }) => {
      await step.run('upsert data', async () => {
        const webhookData = event.data.payload;
        const item = webhookData.data.object;

        const payload = mapToDbRecord(item);

        await db
          .insert(stripeCustomerSubscriptions)
          .values(payload)
          .onConflictDoUpdate({
            target: stripeCustomerSubscriptions.id,
            set: payload,
          });
      });
    },
  );

export const stripeCustomerSubscriptionPendingUpdateExpired =
  inngest.createFunction(
    { id: 'stripe-customer-subscription-pending-update-expired' },
    { event: 'stripe/customer.subscription.pending_update_expired' },
    async ({ event, step }) => {
      await step.run('upsert data', async () => {
        const webhookData = event.data.payload;
        const item = webhookData.data.object;

        const payload = mapToDbRecord(item);

        await db
          .insert(stripeCustomerSubscriptions)
          .values(payload)
          .onConflictDoUpdate({
            target: stripeCustomerSubscriptions.id,
            set: payload,
          });
      });
    },
  );

export const stripeCustomerSubscriptionResumed = inngest.createFunction(
  { id: 'stripe-customer-subscription-resumed' },
  { event: 'stripe/customer.subscription.resumed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCustomerSubscriptions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCustomerSubscriptions.id,
          set: payload,
        });
    });
  },
);

export const customerSubscriptionEvents = [
  stripeCustomerSubscriptionCreated,
  stripeCustomerSubscriptionDeleted,
  stripeCustomerSubscriptionUpdated,
  stripeCustomerSubscriptionPaused,
  stripeCustomerSubscriptionPendingUpdateApplied,
  stripeCustomerSubscriptionPendingUpdateExpired,
  stripeCustomerSubscriptionResumed,
];
