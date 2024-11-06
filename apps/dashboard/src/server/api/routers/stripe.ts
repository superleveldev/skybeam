import { z } from 'zod';
import Stripe from 'stripe';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { env } from '../../../env';
import { getStripeCustomerIdOfOrganization } from '../../queries';
import { db } from '../../db';
import { clerkClient } from '@clerk/nextjs/server';
import {
  SelectCampaignSchema,
  stripeInvoices,
} from '@limelight/shared-drizzle';
import { addMinutes, differenceInDays, getUnixTime, isBefore } from 'date-fns';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const stripeRouter = createTRPCRouter({
  getStripeCustomer: protectedProcedure.query(async ({ ctx }) => {
    const customerId = await getStripeCustomerIdOfOrganization({
      organizationId: ctx.auth.orgId!,
    });

    let customer;

    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    }

    let user;

    user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, ctx.auth.userId),
    });

    if (!user) {
      user = await clerkClient().users.getUser(ctx.auth.userId);
    }

    const { emailAddresses } = user;

    const emailAddress = emailAddresses?.find(
      (email) => email.id === user.primaryEmailAddressId,
    );

    const email =
      emailAddress && 'email_address' in emailAddress
        ? emailAddress.email_address
        : emailAddress?.emailAddress;

    if ((!customerId || customer?.deleted) && email) {
      const { data } = await stripe.customers.list({
        limit: 1,
        email,
      });
      [customer] = data;
    }

    if (!customer && user && email) {
      customer = await stripe.customers.create({
        email,
        name: `${user.firstName} ${user.lastName}`,
      });
    }

    if (!customer) {
      throw new Error('Could not create or find customer');
    }

    let intent;

    const existingIntents = await stripe.setupIntents.list({
      customer: customer.id,
    });

    if (existingIntents?.data?.length) {
      intent = existingIntents.data.find(
        (item) => item.status === 'requires_payment_method',
      );
    }

    if (!intent) {
      intent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
      });
    }
    if (customer?.deleted) {
      throw new Error('Customer has been deleted');
    }

    let card = null;

    const defaultPaymentMethod = customer.invoice_settings
      .default_payment_method as string;

    if (defaultPaymentMethod) {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        defaultPaymentMethod,
      );

      if (paymentMethod?.card) {
        card = {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
        };
      }
    }

    return {
      clientSecret: intent.client_secret,
      defaultPaymentMethod: customer?.invoice_settings.default_payment_method,
      card,
    };
  }),
  savePaymentMethod: protectedProcedure
    .input(z.object({ clientSecret: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [intentID] = input.clientSecret.split('_secret');
      const setupIntent = await stripe.setupIntents.retrieve(intentID);

      await stripe.customers.update(setupIntent.customer as string, {
        invoice_settings: {
          default_payment_method: setupIntent.payment_method as string,
        },
      });
    }),

  deletePaymentMethod: protectedProcedure
    .input(z.object({ defaultPayment: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await stripe.paymentMethods.detach(input.defaultPayment);
    }),
  schedulePayment: protectedProcedure
    .input(SelectCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const customerId = await getStripeCustomerIdOfOrganization({
        organizationId: ctx.auth.orgId!,
      });

      let customer;

      if (customerId) {
        customer = await stripe.customers.retrieve(customerId);
      }
      let user;

      user = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.id, ctx.auth.userId),
      });

      if (!user) {
        user = await clerkClient().users.getUser(ctx.auth.userId);
      }

      const { emailAddresses } = user;

      const emailAddress = emailAddresses?.find(
        (email) => email.id === user.primaryEmailAddressId,
      );

      const email =
        emailAddress && 'email_address' in emailAddress
          ? emailAddress.email_address
          : emailAddress?.emailAddress;

      if ((!customerId || customer?.deleted) && email) {
        const { data } = await stripe.customers.list({
          limit: 1,
          email,
        });
        [customer] = data;
      }

      if (!customer || customer?.deleted) {
        throw new Error('Could not create or find customer');
      }

      let unit_amount: number = input.budget * 100;

      if (input.budgetType === 'daily') {
        const days = Math.abs(differenceInDays(input.endDate, input.startDate));
        unit_amount = unit_amount * days;
      }

      let invoice: Stripe.Invoice | null = null;
      let automatically_finalizes_at = getUnixTime(input.startDate);

      if (isBefore(input.startDate, new Date())) {
        automatically_finalizes_at = getUnixTime(addMinutes(new Date(), 5));
      }

      const existingInvoices = await stripe.invoices.search({
        query: `metadata["campaignId"]:"${input.id}"`,
      });

      const draftInvoices: Stripe.Invoice[] = [];

      if (existingInvoices?.data.length) {
        for (invoice of existingInvoices.data) {
          unit_amount = unit_amount - invoice.amount_due;
          if (invoice.status === 'draft') {
            draftInvoices.push(invoice);
          }
        }
      }

      let draftInvoice: Stripe.Invoice | undefined = draftInvoices?.at(-1);

      draftInvoice ??= await stripe.invoices.create({
        customer: customer.id,
        metadata: { campaignId: input.id },
      });

      if (!draftInvoice) {
        throw new Error('Could not find or create new invoice');
      }

      if (unit_amount !== 0) {
        console.log('Creating invoice item');
        await stripe.invoiceItems.create({
          customer: customer.id,
          currency: 'usd',
          description: input.name,
          invoice: draftInvoice.id,
          amount: unit_amount,
        });
      }

      await stripe.invoices.update(draftInvoice.id, {
        automatically_finalizes_at,
        collection_method: 'charge_automatically',
        auto_advance: true,
      } as Stripe.InvoiceUpdateParams);
    }),
});
