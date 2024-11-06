import {
  targetingGroupCreatives,
  InsertTargetingGroupCreativeSchema,
} from '@limelight/shared-drizzle';
import { db } from '../../db';
import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export const targetingGroupCreativesRouter = createTRPCRouter({
  getTargetingGroupCreative: protectedOrgProcedure
    .input(
      z.object({
        targetingGroupId: z.string(),
      }),
    )
    .query(
      async ({
        input: { targetingGroupId = '' },
        ctx: {
          auth: { orgId },
        },
      }) => {
        if (!orgId) {
          throw new Error('User organization not found');
        }
        return db.query.targetingGroupCreatives.findMany({
          with: { creative: true, targetingGroup: true },
          where: (targetingGroupCreatives, { eq }) =>
            eq(targetingGroupCreatives.targetingGroupId, targetingGroupId),
        });
      },
    ),
  createTargetingGroupCreative: protectedOrgProcedure
    .input(InsertTargetingGroupCreativeSchema)
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
        return db.insert(targetingGroupCreatives).values(input).returning();
      },
    ),
  updateTargetingGroupCreative: protectedOrgProcedure
    .input(InsertTargetingGroupCreativeSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id, updatedAt, createdAt, ...targetingGroupCreativesData } =
        input;

      return db
        .update(targetingGroupCreatives)
        .set(targetingGroupCreativesData)
        .where(eq(targetingGroupCreatives.id, input.id))
        .returning();
    }),
});
