import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  organizationAdminProcedure,
  organizationMemberProcedure,
} from '../trpc';
import { clerkClient } from '@clerk/nextjs/server';
import { and, isNull } from 'drizzle-orm';
import { env } from '../../../env';
import { getStripeCustomerIdOfOrganization } from '../../queries';

const isLocal = env.NODE_ENV === 'development';

const paginationSchema = z.object({
  orderBy: z
    .enum([
      'email_address',
      '-email_address',
      'first_name',
      '-first_name',
      'created_at',
      '-created_at',
    ])
    .optional(),
  query: z.string().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
});

export const organizationsRouter = createTRPCRouter({
  inviteMember: organizationAdminProcedure
    .input(
      z.object({ name: z.string().min(2).max(200), email: z.string().email() }),
    )
    .mutation(async ({ ctx, input }) => {
      return clerkClient.organizations.createOrganizationInvitation({
        organizationId: ctx.auth.orgId!,
        inviterUserId: ctx.auth.userId!,
        emailAddress: input.email,
        role: 'org:member',
        publicMetadata: {
          name: input.name,
        },
      });
    }),
  revokeInvite: organizationAdminProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return clerkClient.organizations.revokeOrganizationInvitation({
        organizationId: ctx.auth.orgId!,
        requestingUserId: ctx.auth.userId!,
        invitationId: input.inviteId,
      });
    }),
  getActivePlanLevel: organizationMemberProcedure.query(
    async ({ ctx, input }) => {
      const results = await ctx.db.query.organizations.findFirst({
        columns: {
          id: true,
          manualPlanLevel: true,
        },
        with: {
          stripeCustomer: {
            columns: {
              id: true,
            },
            with: {
              subscriptions: {
                columns: {
                  id: true,
                  status: true,
                  items: true,
                },
              },
            },
          },
        },
        where: (model, { eq }) =>
          and(eq(model.id, ctx.auth.orgId!), isNull(model.deletedAt)),
      });

      if (results?.manualPlanLevel) return results.manualPlanLevel;

      if (!results?.stripeCustomer?.subscriptions?.length) return 'free';

      const ownedProducts: Record<string, true> = {};

      for (const subscription of results.stripeCustomer.subscriptions) {
        if (
          subscription.status === 'active' &&
          subscription.items?.data.length
        ) {
          for (const item of subscription.items.data) {
            ownedProducts[item.plan.product as string] = true;
          }
        }
      }

      const productIds = Object.keys(ownedProducts);

      if (!productIds.length) return 'free';

      for (const item of [env.STRIPE_PRODUCT_ID_PLUS]) {
        if (productIds.includes(item)) return 'plus';
      }

      for (const item of [env.STRIPE_PRODUCT_ID_STANDARD]) {
        if (productIds.includes(item)) return 'standard';
      }

      return 'free';
    },
  ),
  getStripeCustomerId: organizationMemberProcedure.query(({ ctx, input }) => {
    return getStripeCustomerIdOfOrganization({
      organizationId: ctx.auth.orgId!,
    });
  }),
  getInvites: organizationMemberProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const results =
        await clerkClient.organizations.getOrganizationInvitationList({
          organizationId: ctx.auth.orgId!,
          status: ['pending', 'accepted', 'revoked'],
          limit: input?.limit ? +input.limit : 10,
          offset: input.page ? (+input.page - 1) * +(input.limit ?? 10) : 0,
        });

      const data = (results?.data ?? []).map((invite) => {
        const email = invite.emailAddress;
        const name = invite.publicMetadata?.name
          ? `${invite.publicMetadata.name}`
          : '';
        const createdAt = invite.createdAt;
        const status = invite.status;
        const id = invite.id;
        const role = invite.role;
        const updatedAt = invite.updatedAt;

        return { email, name, createdAt, status, id, role, updatedAt };
      });

      return { data, totalCount: results.totalCount };
    }),
  changeMembership: organizationAdminProcedure
    .input(z.object({ userId: z.string(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return clerkClient().organizations.updateOrganizationMembership({
        organizationId: ctx.auth.orgId!,
        userId: input.userId,
        role: input.role,
      });
    }),
  removeMembership: organizationAdminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return clerkClient.organizations.deleteOrganizationMembership({
        organizationId: ctx.auth.orgId!,
        userId: input.userId,
      });
    }),
  getMembers: organizationMemberProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { orderBy = '-created_at', query } = input;
      const results = await clerkClient().users.getUserList({
        organizationId: [ctx.auth.orgId!],
        orderBy,
        query: query?.length && query.length > 2 ? query : undefined,
        limit: input?.limit ? +input.limit : 10,
        offset: input.page ? (+input.page - 1) * +(input.limit ?? 10) : 0,
      });

      const memberships =
        await clerkClient().organizations.getOrganizationMembershipList({
          organizationId: ctx.auth.orgId!,
        });
      const membershipMap = Object.fromEntries(
        memberships?.data?.map((membership) => [
          membership.publicUserData?.userId,
          { role: membership.role, id: membership.id },
        ]) ?? [],
      );

      const data = (results?.data ?? []).map((user) => {
        let email = user.primaryEmailAddress?.emailAddress;

        email ??= user.emailAddresses?.find(
          (emailAddress) =>
            emailAddress.emailAddress === user?.primaryEmailAddressId,
        )?.emailAddress;

        let name = user.fullName;

        let { firstName, lastName } = user;

        firstName ??= '';
        lastName ??= '';

        name ??= [firstName, lastName].filter(Boolean).join(' ');

        return {
          id: user.id,
          email,
          name,
          createdAt: user.createdAt,
          membership: membershipMap[user.id] ?? { role: 'org:member', id: '' },
        };
      });

      return { ...results, data };
    }),
  getMemberCount: organizationMemberProcedure.query(async ({ ctx, input }) => {
    if (isLocal) return 1;

    const results =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: ctx.auth.orgId!,
      });

    return results?.data?.length ?? 0;
  }),
  createOrganization: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const name = input.name;
      const createdBy = ctx.auth.userId;

      return clerkClient.organizations.createOrganization({
        name,
        createdBy,
      });
    }),
  updateOrganization: organizationAdminProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const name = input.name;
      const organizationId = ctx.auth.orgId!;

      return clerkClient.organizations.updateOrganization(organizationId, {
        name,
      });
    }),
  deleteOrganization: organizationAdminProcedure.mutation(
    async ({ ctx, input }) => {
      const organizationId = ctx.auth.orgId!;

      return clerkClient.organizations.deleteOrganization(organizationId);
    },
  ),
});
