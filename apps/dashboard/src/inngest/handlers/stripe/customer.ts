import { inngest } from '../../client';
import { stripeCustomers } from '@limelight/shared-drizzle';
import { db } from '../../../server/db';
import { type Stripe } from 'stripe';

const mapToDbRecord = (
  item: Stripe.Customer,
): Omit<
  typeof stripeCustomers.$inferSelect,
  'updatedAt' | 'deletedAt' | 'organizationId'
> => {
  return {
    id: item.id,
    object: item.object,
    address: item.address,
    balance: item.balance,
    cashBalance: item.cash_balance,
    currency: item.currency,
    defaultSource: item.default_source,
    deleted: item.deleted,
    delinquent: item.delinquent,
    description: item.description,
    discount: item.discount,
    email: item.email,
    invoiceCreditBalance: item.invoice_credit_balance,
    invoicePrefix: item.invoice_prefix,
    invoiceSettings: item.invoice_settings,
    livemode: item.livemode,
    metadata: item.metadata,
    name: item.name,
    nextInvoiceSequence: item.next_invoice_sequence,
    phone: item.phone,
    preferredLocales: item.preferred_locales,
    shipping: item.shipping,
    sources: item.sources,
    subscriptions: item.subscriptions,
    tax: item.tax,
    taxExempt: item.tax_exempt,
    taxIds: item.tax_ids,
    testClock: item.test_clock,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
  };
};

export const stripeCustomerCreated = inngest.createFunction(
  { id: 'stripe-customer-created' },
  { event: 'stripe/customer.created' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCustomers).values(payload).onConflictDoUpdate({
        target: stripeCustomers.id,
        set: payload,
      });
    });
  },
);

export const stripeCustomerDeleted = inngest.createFunction(
  { id: 'stripe-customer-deleted' },
  { event: 'stripe/customer.deleted' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCustomers).values(payload).onConflictDoUpdate({
        target: stripeCustomers.id,
        set: payload,
      });
    });
  },
);

export const stripeCustomerUpdated = inngest.createFunction(
  { id: 'stripe-customer-updated' },
  { event: 'stripe/customer.updated' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeCustomers).values(payload).onConflictDoUpdate({
        target: stripeCustomers.id,
        set: payload,
      });
    });
  },
);

export const customerEvents = [
  stripeCustomerCreated,
  stripeCustomerDeleted,
  stripeCustomerUpdated,
];
