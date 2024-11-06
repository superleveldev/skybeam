import {
  deletions,
  InsertTargetingGroupSchema,
  targetingGroups,
} from '@limelight/shared-drizzle';
import { db } from '../../db';
import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import { z } from 'zod';
import { differenceInDays } from 'date-fns';
import { and, eq } from 'drizzle-orm';

export const TargetingGroupsRouter = createTRPCRouter({
  getTargetingGroups: protectedOrgProcedure
    .input(
      z.object({
        campaignId: z.string(),
      }),
    )
    .query(
      async ({
        input: { campaignId = '' },
        ctx: {
          auth: { orgId },
        },
      }) => {
        if (!orgId) {
          throw new Error('User organization not found');
        }
        return db.query.targetingGroups.findMany({
          where: (targetingGroups, { eq }) =>
            eq(targetingGroups.campaignId, campaignId),
          orderBy: (targetingGroups, { asc }) => [
            asc(targetingGroups.createdAt),
          ],
        });
      },
    ),
  getTargetingGroup: protectedOrgProcedure
    .input(
      z.object({
        campaignId: z.string(),
        groupId: z.string(),
      }),
    )
    .query(
      async ({
        input: { campaignId = '', groupId = '' },
        ctx: {
          auth: { orgId },
        },
      }) => {
        if (!orgId) {
          throw new Error('User organization not found');
        }
        return db.query.targetingGroups.findMany({
          where: (targetingGroups, { eq }) =>
            and(
              eq(targetingGroups.campaignId, campaignId),
              eq(targetingGroups.id, groupId),
            ),
        });
      },
    ),
  createTargetingGroup: protectedOrgProcedure
    .input(InsertTargetingGroupSchema)
    .mutation(
      async ({
        input,
        ctx: {
          auth: { orgId: clerkOrganizationId },
        },
      }) => {
        if (!clerkOrganizationId) {
          throw new Error('User organization not found');
        }
        return db.insert(targetingGroups).values(input).returning();
      },
    ),
  updateTargetingGroup: protectedOrgProcedure
    .input(InsertTargetingGroupSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { altId, id, updatedAt, createdAt, ...targetingGroupData } = input;

      return db
        .update(targetingGroups)
        .set(targetingGroupData)
        .where(eq(targetingGroups.id, input.id))
        .returning();
    }),
  deleteTargetingGroup: protectedOrgProcedure.input(z.string()).mutation(
    async ({
      input,
      ctx: {
        auth: { userId },
      },
    }) => {
      const targetingGroup = await db.query.targetingGroups.findFirst({
        where: (groups, { eq }) => {
          return eq(groups.id, input);
        },
      });

      if (!targetingGroup || !targetingGroup.id) {
        throw new Error('Targeting Group not found');
      }
      const campaign = await db.query.campaigns.findFirst({
        where: (campaigns, { eq }) =>
          eq(campaigns.id, targetingGroup.campaignId),
      });

      if (campaign?.status === 'published') {
        throw new Error('Cannot delete targeting group from active campaign');
      }

      const snapshot = JSON.stringify(targetingGroup);

      const deletion = await db
        .insert(deletions)
        .values({
          objectType: 'targeting_group',
          objectId: input,
          data: snapshot,
          deletedBy: userId,
        })
        .returning();

      if (!deletion || !deletion[0].id) {
        throw new Error('Failed to save targeting group snapshot');
      }
      return db
        .delete(targetingGroups)
        .where(eq(targetingGroups.id, input))
        .returning();
    },
  ),
  getRemainingBudget: protectedOrgProcedure
    .input(
      z.object({
        campaignId: z.string(),
        budget: z.number(),
        currentTgId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const campaignData = await db.query.campaigns.findFirst({
        where: (campaigns, { eq }) => eq(campaigns.id, input.campaignId),
        with: {
          targetingGroups: true,
        },
      });
      if (!campaignData) {
        throw new Error('Campaign not found');
      }
      const campaignDuration = differenceInDays(
        campaignData.endDate,
        campaignData.startDate,
      );
      let totalBudget = campaignData.budget;
      if (campaignData.budgetType === 'daily') {
        totalBudget =
          campaignData.budget *
          differenceInDays(campaignData.endDate, campaignData.startDate);
      }
      let usedBudget = 0;
      campaignData.targetingGroups?.forEach((tg) => {
        usedBudget +=
          tg.id === input.currentTgId ? 0 : tg.budget * campaignDuration;
      });
      const remaining = totalBudget - usedBudget;
      return { remaining, campaignDuration };
    }),
  getNextTargetingGroupId: protectedOrgProcedure
    .input(
      z.object({ campaignId: z.string(), currentTgId: z.string().optional() }),
    )
    .query(async ({ input }) => {
      const targetingGroups = await db.query.targetingGroups.findMany({
        where: (model, { eq }) => eq(model.campaignId, input.campaignId),
        orderBy: (model, { asc }) => [asc(model.createdAt)],
      });

      if (!targetingGroups.length) {
        return null;
      }

      if (!input.currentTgId) {
        return targetingGroups[0].id;
      }

      let nextTgIdx = -1;

      for (let idx = 0; idx < targetingGroups.length - 1; idx += 1) {
        const tg = targetingGroups[idx];
        if (tg.id === input.currentTgId) {
          nextTgIdx = idx + 1;
          break;
        }
      }

      if (nextTgIdx > 0) {
        return targetingGroups[nextTgIdx].id;
      }

      return null;
    }),
});
