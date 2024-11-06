import { inngest } from '../../client';
import { db } from '../../../server/db';
import { stripeRefunds } from '@limelight/shared-drizzle';
import { type Stripe } from 'stripe';

const mapToDbRecord = (
  item: Stripe.Refund,
): Omit<typeof stripeRefunds.$inferSelect, 'updatedAt' | 'deletedAt'> => {
  return {
    id: item.id,
    amount: item.amount,
    object: item.object,
    balanceTransaction: item.balance_transaction,
    charge: item.charge,
    currency: item.currency,
    description: item.description,
    destinationDetails: item.destination_details,
    failureBalanceTransaction: item.failure_balance_transaction,
    failureReason: item.failure_reason,
    instructionsEmail: item.instructions_email,
    metadata: item.metadata,
    nextAction: item.next_action,
    paymentIntent: item.payment_intent,
    reason: item.reason,
    receiptNumber: item.receipt_number,
    sourceTransferReversal: item.source_transfer_reversal,
    status: item.status,
    transferReversal: item.transfer_reversal,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
  };
};

export const stripeRefundCreated = inngest.createFunction(
  { id: 'stripe-refund-created' },
  { event: 'stripe/refund.created' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeRefunds).values(payload).onConflictDoUpdate({
        target: stripeRefunds.id,
        set: payload,
      });
    });
  },
);

export const stripeRefundUpdated = inngest.createFunction(
  { id: 'stripe-refund-updated' },
  { event: 'stripe/refund.updated' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeRefunds).values(payload).onConflictDoUpdate({
        target: stripeRefunds.id,
        set: payload,
      });
    });
  },
);

export const refundEvents = [stripeRefundCreated, stripeRefundUpdated];
