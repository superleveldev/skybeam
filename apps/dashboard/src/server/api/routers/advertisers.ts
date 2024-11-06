import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../db';
import {
  advertisers,
  deletions,
  InsertAdvertiserSchema,
  selectAdvertiserSchema,
} from '@limelight/shared-drizzle';
import { eq, sql } from 'drizzle-orm';

export const advertisersRouter = createTRPCRouter({
  getAdvertiser: protectedOrgProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.query.advertisers.findFirst({
        where: (advertisers, { eq }) => eq(advertisers.id, input),
      });
    }),
  getAdvertisers: protectedOrgProcedure
    .input(
      z.object({
        limit: z.string().optional(),
        page: z.string().optional(),
        sort: selectAdvertiserSchema.keyof().optional(),
        sortDir: z.enum(['asc', 'desc']).optional(),
      }),
    )
    .query(
      async ({
        input,
        ctx: {
          auth: { orgId },
        },
      }) => {
        if (!orgId) {
          throw new Error('User organization not found');
        }

        const { limit: _limit, page: _page, sort, sortDir } = input ?? {};

        const limit = _limit ? parseInt(_limit) : undefined;

        const offset =
          limit && _page ? (parseInt(_page) - 1) * limit : undefined;

        const data = await db.query.advertisers.findMany({
          where: (advertisers, { eq }) =>
            eq(advertisers.clerkOrganizationId, orgId),
          orderBy: (advertisers, { asc, desc }) =>
            sortDir === 'asc'
              ? asc(advertisers[sort ?? 'updatedAt'])
              : desc(advertisers[sort ?? 'updatedAt']),
          limit,
          offset,
        });

        const [meta] = await db
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(advertisers)
          .where(eq(advertisers.clerkOrganizationId, orgId));

        return { data, meta };
      },
    ),

  insertAdvertiser: protectedOrgProcedure
    .input(InsertAdvertiserSchema)
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
        return db
          .insert(advertisers)
          .values({ ...input, clerkOrganizationId })
          .returning();
      },
    ),

  updateAdvertiser: protectedOrgProcedure
    .input(InsertAdvertiserSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { altId, id, updatedAt, createdAt, ...advertiserData } = input;

      return db
        .update(advertisers)
        .set(advertiserData)
        .where(eq(advertisers.id, input.id))
        .returning();
    }),

  deleteAdvertiser: protectedOrgProcedure.input(z.string()).mutation(
    async ({
      input,
      ctx: {
        auth: { userId },
      },
    }) => {
      const advertiserData = await db.query.advertisers.findMany({
        where: (advertisers, { eq }) => {
          return eq(advertisers.id, input);
        },
      });

      if (!advertiserData.length || !advertiserData[0].id) {
        throw new Error('Advertiser not found');
      }

      const snapshot = JSON.stringify(advertiserData[0]);

      const deletion = await db
        .insert(deletions)
        .values({
          objectType: 'advertiser',
          objectId: input,
          data: snapshot,
          deletedBy: userId,
        })
        .returning();

      if (!deletion || !deletion[0].id) {
        throw new Error('Failed to save advertiser snapshot');
      }

      return db.delete(advertisers).where(eq(advertisers.id, input)).returning({
        id: advertisers.id,
        externalId: advertisers.externalId,
        name: advertisers.name,
        website: advertisers.website,
        industry: advertisers.industry,
      });
    },
  ),
});
