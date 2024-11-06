import { inngest } from '../../client';
import { type Stripe } from 'stripe';
import {
  organizations,
  stripeCheckoutSessions,
  stripeCustomers,
} from '@limelight/shared-drizzle';
import { db } from '../../../server/db';
import { eq } from 'drizzle-orm';

const mapToDbRecord = (
  item: Stripe.Checkout.Session,
): Omit<
  typeof stripeCheckoutSessions.$inferSelect,
  'updatedAt' | 'deletedAt'
> => {
  return {
    id: item.id,
    object: item.object,
    afterExpiration: item.after_expiration,
    allowPromotionCodes: item.allow_promotion_codes,
    amountSubtotal: item.amount_subtotal,
    amountTotal: item.amount_total,
    automaticTax: item.automatic_tax,
    billingAddressCollection: item.billing_address_collection,
    cancelUrl: item.cancel_url,
    clientReferenceId: item.client_reference_id,
    clientSecret: item.client_secret,
    consent: item.consent,
    consentCollection: item.consent_collection,
    currency: item.currency,
    currencyConversion: item.currency_conversion,
    customFields: item.custom_fields,
    customText: item.custom_text,
    customer: item.customer,
    customerCreation: item.customer_creation,
    customerDetails: item.customer_details,
    customerEmail: item.customer_email,
    invoice: item.invoice,
    invoiceCreation: item.invoice_creation,
    lineItems: item.line_items,
    livemode: item.livemode,
    locale: item.locale,
    metadata: item.metadata,
    mode: item.mode,
    paymentIntent: item.payment_intent,
    paymentLink: item.payment_link,
    paymentMethodCollection: item.payment_method_collection,
    paymentMethodConfigurationDetails:
      item.payment_method_configuration_details,
    paymentMethodOptions: item.payment_method_options,
    paymentMethodTypes: item.payment_method_types,
    paymentStatus: item.payment_status,
    phoneNumberCollection: item.phone_number_collection,
    recoveredFrom: item.recovered_from,
    redirectOnCompletion: item.redirect_on_completion,
    returnUrl: item.return_url,
    savedPaymentMethodOptions: item.saved_payment_method_options,
    setupIntent: item.setup_intent,
    shippingAddressCollection: item.shipping_address_collection,
    shippingCost: item.shipping_cost,
    shippingDetails: item.shipping_details,
    shippingOptions: item.shipping_options,
    status: item.status,
    submitType: item.submit_type,
    subscription: item.subscription,
    successUrl: item.success_url,
    taxIdCollection: item.tax_id_collection,
    totalDetails: item.total_details,
    uiMode: item.ui_mode,
    url: item.url,
    createdAt: item.created ? new Date(item.created * 1000) : new Date(),
    expiresAt: item.expires_at ? new Date(item.expires_at * 1000) : null,
  };
};

export const stripeCheckoutSessionAsyncPaymentFailed = inngest.createFunction(
  { id: 'stripe-checkout-session-async-payment-failed' },
  { event: 'stripe/checkout.session.async_payment_failed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCheckoutSessions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCheckoutSessions.id,
          set: payload,
        });
    });
  },
);

export const stripeCheckoutSessionAsyncPaymentSucceeded =
  inngest.createFunction(
    { id: 'stripe-checkout-session-async-payment-async-payment-succeeded' },
    { event: 'stripe/checkout.session.async_payment_succeeded' },
    async ({ event, step }) => {
      await step.run('upsert data', async () => {
        const webhookData = event.data.payload;
        const item = webhookData.data.object;

        const orgId = item.metadata?.orgId;

        if (!orgId) throw new Error('orgId not found in metadata');

        const payload = mapToDbRecord(item);

        await db
          .insert(stripeCheckoutSessions)
          .values(payload)
          .onConflictDoUpdate({
            target: stripeCheckoutSessions.id,
            set: payload,
          });
      });

      await step.run('associate customer with org', async () => {
        const webhookData = event.data.payload;
        const item = webhookData.data.object;

        const orgId = item.metadata?.orgId;

        if (!orgId) throw new Error('orgId not found in metadata');

        const customerId = item.customer;

        if (!customerId) throw new Error('customerId not found');

        const payload = {
          id: customerId as string,
          organizationId: orgId,
        };

        await db.insert(stripeCustomers).values(payload).onConflictDoUpdate({
          target: stripeCheckoutSessions.id,
          set: payload,
        });
      });
    },
  );

export const stripeCheckoutSessionCompleted = inngest.createFunction(
  { id: 'stripe-checkout-session-completed' },
  { event: 'stripe/checkout.session.completed' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCheckoutSessions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCheckoutSessions.id,
          set: payload,
        });
    });

    await step.run('associate customer with org', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const orgId = item.metadata?.orgId;

      if (!orgId) throw new Error('orgId not found in metadata');

      const customerId = item.customer;

      if (!customerId) throw new Error('customerId not found');

      try {
        await db
          .update(organizations)
          .set({ stripeCustomerId: customerId as string })
          .where(eq(organizations.id, orgId));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization found to update, ignoring');
      }
    });
  },
);

export const stripeCheckoutSessionExpired = inngest.createFunction(
  { id: 'stripe-checkout-session-expired' },
  { event: 'stripe/checkout.session.expired' },
  async ({ event, step }) => {
    await step.run('upsert data', async () => {
      const webhookData = event.data.payload;
      const item = webhookData.data.object;

      const payload = mapToDbRecord(item);

      await db
        .insert(stripeCheckoutSessions)
        .values(payload)
        .onConflictDoUpdate({
          target: stripeCheckoutSessions.id,
          set: payload,
        });
    });
  },
);

export const checkoutSessionEvents = [
  stripeCheckoutSessionAsyncPaymentFailed,
  stripeCheckoutSessionAsyncPaymentSucceeded,
  stripeCheckoutSessionCompleted,
  stripeCheckoutSessionExpired,
];
