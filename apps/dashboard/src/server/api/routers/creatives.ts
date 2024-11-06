import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import {
  creatives,
  InsertCreativesSchema,
  UpdateCreativesSchema,
} from '@limelight/shared-drizzle';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db';

export const creativesRouter = createTRPCRouter({
  getCreative: protectedOrgProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(
      async ({
        input: { id = '' },
        ctx: {
          auth: { orgId },
        },
      }) => {
        return await db.query.creatives.findFirst({
          with: { advertiser: true },
          where: (creatives, { eq }) => {
            return eq(creatives.id, id);
          },
        });
      },
    ),
  getCreativesByAdvertiser: protectedOrgProcedure
    .input(z.object({ advertiserId: z.string().uuid() }))
    .query(
      async ({
        input: { advertiserId = '' },
        ctx: {
          auth: { orgId },
        },
      }) => {
        return await db.query.creatives.findMany({
          where: (creatives, { eq }) => {
            return eq(creatives.advertiserId, advertiserId);
          },
        });
      },
    ),
  insertBaseCreative: protectedOrgProcedure
    .input(InsertCreativesSchema)
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
        return db.insert(creatives).values(input).returning();
      },
    ),
  updateCreative: protectedOrgProcedure
    .input(UpdateCreativesSchema)
    .mutation(async ({ input }) => {
      return db
        .update(creatives)
        .set(input)
        .where(eq(creatives.id, input.id))
        .returning();
    }),
});
