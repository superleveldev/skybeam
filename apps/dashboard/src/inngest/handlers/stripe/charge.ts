import { inngest } from '../../client';
import { db } from '../../../server/db';
import { type Stripe } from 'stripe';
import { stripeCharges } from '@limelight/shared-drizzle';

const mapToDbRecord = (
  item: Stripe.Charge,
): Omit<typeof stripeCharges.$inferSelect, 'updatedAt' | 'deletedAt'> => {
  return {
    id: item.id,
    object: item.object,
    amount: item.amount,
    amountCaptured: item.amount_captured,
    amountRefunded: item.amount_refunded,
    application: item.application,
    applicationFee: item.application_fee,
    applicationFeeAmount: item.application_fee_amount,
    authorizationCode: item.authorization_code,
    balanceTransaction: item.balance_transaction,
    billingDetails: item.billing_details,
    calculatedStatementDescriptor: item.calculated_statement_descriptor,
    captured: item.captured,
    currency: item.currency,
    customer: item.customer,
    description: item.description,
    disputed: item.disputed,
    failureBalanceTransaction: item.failure_balance_transaction,
    failureCode: item.failure_code,
    failureMessage: item.failure_message,
    fraudDetails: item.fraud_details,
    invoice: item.invoice,
    level3: item.level3,
    livemode: item.livemode,
    metadata: item.metadata,
    onBehalfOf: item.on_behalf_of,
    outcome: item.outcome,
    paid: item.paid,
    paymentIntent: item.payment_intent,
    paymentMethod: item.payment_method,
    paymentMethodDetails: item.payment_method_details,
    radarOptions: item.radar_options,
    receiptEmail: item.receipt_email,
    receiptNumber: item.receipt_number,
    receiptUrl: item.receipt_url,
    refunded: item.refunded,
    refunds: item.refunds,
    review: item.review,
    shipping: item.shipping,
    sourceTransfer: item.source_transfer,
    statementDescriptor: item.statement_descriptor,
    statementDescriptorSuffix: item.statement_descriptor_suffix,
    status: item.status,
    transfer: item.transfer,
    transferData: item.transfer_data,
    transferGroup: item.transfer_group,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
  };
};

export const stripeChargeCaptured = inngest.createFunction(
  { id: 'stripe-charge-captured' },
  { event: 'stripe/charge.captured' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const stripeChargeExpired = inngest.createFunction(
  { id: 'stripe-charge-expired' },
  { event: 'stripe/charge.expired' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const stripeChargeFailed = inngest.createFunction(
  { id: 'stripe-charge-failed' },
  { event: 'stripe/charge.failed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const stripeChargePending = inngest.createFunction(
  { id: 'stripe-charge-pending' },
  { event: 'stripe/charge.pending' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const stripeChargeRefunded = inngest.createFunction(
  { id: 'stripe-charge-refunded' },
  { event: 'stripe/charge.refunded' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const stripeChargeSucceeded = inngest.createFunction(
  { id: 'stripe-charge-succeeded' },
  { event: 'stripe/charge.succeeded' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const stripeChargeUpdated = inngest.createFunction(
  { id: 'stripe-charge-updated' },
  { event: 'stripe/charge.updated' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCharges).values(payload).onConflictDoUpdate({
        target: stripeCharges.id,
        set: payload,
      });
    });
  },
);

export const chargeEvents = [
  stripeChargeCaptured,
  stripeChargeExpired,
  stripeChargeFailed,
  stripeChargePending,
  stripeChargeRefunded,
  stripeChargeSucceeded,
  stripeChargeUpdated,
];
