import { inngest } from '../../client';
import { db } from '../../../server/db';
import { type Stripe } from 'stripe';
import { stripeInvoices } from '@limelight/shared-drizzle';

const mapToDbRecord = (
  item: Stripe.Invoice,
): Omit<typeof stripeInvoices.$inferSelect, 'updatedAt' | 'deletedAt'> => {
  return {
    id: item.id,
    object: item.object,
    accountCountry: item.account_country,
    accountName: item.account_name,
    accountTaxIds: item.account_tax_ids,
    amountDue: item.amount_due,
    amountPaid: item.amount_paid,
    amountRemaining: item.amount_remaining,
    amountShipping: item.amount_shipping,
    application: item.application,
    applicationFeeAmount: item.application_fee_amount,
    attemptCount: item.attempt_count,
    attempted: item.attempted,
    autoAdvance: item.auto_advance,
    automaticTax: item.automatic_tax,
    billingReason: item.billing_reason,
    charge: item.charge,
    collectionMethod: item.collection_method,
    currency: item.currency,
    customFields: item.custom_fields,
    customer: item.customer,
    customerAddress: item.customer_address,
    customerEmail: item.customer_email,
    customerName: item.customer_name,
    customerPhone: item.customer_phone,
    customerShipping: item.customer_shipping,
    customerTaxExempt: item.customer_tax_exempt,
    customerTaxIds: item.customer_tax_ids,
    defaultPaymentMethod: item.default_payment_method,
    defaultSource: item.default_source,
    defaultTaxRates: item.default_tax_rates,
    deleted: item.deleted,
    description: item.description,
    discount: item.discount,
    discounts: item.discounts,
    endingBalance: item.ending_balance,
    footer: item.footer,
    fromInvoice: item.from_invoice,
    hostedInvoiceUrl: item.hosted_invoice_url,
    invoicePdf: item.invoice_pdf,
    issuer: item.issuer,
    lastFinalizationError: item.last_finalization_error,
    latestRevision: item.latest_revision,
    lines: item.lines,
    livemode: item.livemode,
    metadata: item.metadata,
    number: item.number,
    onBehalfOf: item.on_behalf_of,
    paid: item.paid,
    paidOutOfBand: item.paid_out_of_band,
    paymentIntent: item.payment_intent,
    paymentSettings: item.payment_settings,
    postPaymentCreditNotesAmount: item.post_payment_credit_notes_amount,
    prePaymentCreditNotesAmount: item.pre_payment_credit_notes_amount,
    quote: item.quote,
    receiptNumber: item.receipt_number,
    rendering: item.rendering,
    shippingCost: item.shipping_cost,
    shippingDetails: item.shipping_details,
    startingBalance: item.starting_balance,
    statementDescriptor: item.statement_descriptor,
    status: item.status,
    statusTransitions: item.status_transitions,
    subscription: item.subscription,
    subscriptionDetails: item.subscription_details,
    subtotal: item.subtotal,
    subtotalExcludingTax: item.subtotal_excluding_tax,
    tax: item.tax,
    testClock: item.test_clock,
    thresholdReason: item.threshold_reason,
    total: item.total,
    totalDiscountAmounts: item.total_discount_amounts,
    totalExcludingTax: item.total_excluding_tax,
    totalTaxAmounts: item.total_tax_amounts,
    transferData: item.transfer_data,
    subscriptionProrationDate: item.subscription_proration_date
      ? new Date(item.subscription_proration_date * 1000)
      : null,
    nextPaymentAttempt: item.next_payment_attempt
      ? new Date(item.next_payment_attempt * 1000)
      : null,
    webhooksDeliveredAt: item.webhooks_delivered_at
      ? new Date(item.webhooks_delivered_at * 1000)
      : null,
    periodEnd: item.period_end ? new Date(item.period_end * 1000) : null,
    periodStart: item.period_start ? new Date(item.period_start * 1000) : null,
    dueDate: item.due_date ? new Date(item.due_date * 1000) : null,
    effectiveAt: item.effective_at ? new Date(item.effective_at * 1000) : null,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
    campaignId: item.metadata?.campaignId || null,
  };
};

export const stripeInvoiceCreated = inngest.createFunction(
  { id: 'stripe-invoice-created' },
  { event: 'stripe/invoice.created' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceDeleted = inngest.createFunction(
  { id: 'stripe-invoice-deleted' },
  { event: 'stripe/invoice.deleted' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceUpdated = inngest.createFunction(
  { id: 'stripe-invoice-updated' },
  { event: 'stripe/invoice.updated' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceFinalizationFailed = inngest.createFunction(
  { id: 'stripe-invoice-finalization-failed' },
  { event: 'stripe/invoice.finalization_failed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceFinalized = inngest.createFunction(
  { id: 'stripe-invoice-finalized' },
  { event: 'stripe/invoice.finalized' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceMarkedUncollectible = inngest.createFunction(
  { id: 'stripe-invoice-marked-uncollectible' },
  { event: 'stripe/invoice.marked_uncollectible' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoicePaid = inngest.createFunction(
  { id: 'stripe-invoice-paid' },
  { event: 'stripe/invoice.paid' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoicePaymentActionRequired = inngest.createFunction(
  { id: 'stripe-invoice-payment-action-required' },
  { event: 'stripe/invoice.payment_action_required' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoicePaymentFailed = inngest.createFunction(
  { id: 'stripe-invoice-payment-failed' },
  { event: 'stripe/invoice.payment_failed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoicePaymentSucceeded = inngest.createFunction(
  { id: 'stripe-invoice-payment-succeeded' },
  { event: 'stripe/invoice.payment_succeeded' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceSent = inngest.createFunction(
  { id: 'stripe-invoice-sent' },
  { event: 'stripe/invoice.sent' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceUpcoming = inngest.createFunction(
  { id: 'stripe-invoice-upcoming' },
  { event: 'stripe/invoice.upcoming' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const stripeInvoiceVoided = inngest.createFunction(
  { id: 'stripe-invoice-voided' },
  { event: 'stripe/invoice.voided' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db.insert(stripeInvoices).values(payload).onConflictDoUpdate({
        target: stripeInvoices.id,
        set: payload,
      });
    });
  },
);

export const invoiceEvents = [
  stripeInvoiceCreated,
  stripeInvoiceDeleted,
  stripeInvoiceUpdated,
  stripeInvoiceFinalizationFailed,
  stripeInvoiceFinalized,
  stripeInvoiceMarkedUncollectible,
  stripeInvoicePaid,
  stripeInvoicePaymentActionRequired,
  stripeInvoicePaymentFailed,
  stripeInvoicePaymentSucceeded,
  stripeInvoiceSent,
  stripeInvoiceUpcoming,
  stripeInvoiceVoided,
];
