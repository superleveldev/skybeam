import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../db';
import {
  advertisers as advertisersSchema,
  campaigns,
  campaignSortSchema,
  deletions,
  InsertCampaignSchema,
  statusEnum,
  TargetingGroup,
  targetingGroups,
} from '@limelight/shared-drizzle';
import { and, eq, ilike, inArray, sql } from 'drizzle-orm';
import { STATS } from './_temp-data';
import {
  capitalize,
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
} from '@limelight/shared-utils/index';

export const campaignsRouter = createTRPCRouter({
  getCampaign: protectedOrgProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input: { id = '' } }) => {
      const data = await db.query.campaigns.findMany({
        with: { advertiser: true },
        where: (campaigns, { eq }) => {
          return eq(campaigns.id, id);
        },
      });
      return data;
    }),
  getCampaigns: protectedOrgProcedure
    .input(
      z.object({
        limit: z.string().optional(),
        page: z.string().optional(),
        search: z.string().optional(),
        sort: campaignSortSchema.optional(),
        sortDir: z.enum(['asc', 'desc']).optional(),
        status: z.enum(statusEnum.enumValues).optional(),
      }),
    )
    .query(
      async ({
        input: {
          limit: limitString = '10',
          page: pageString = '1',
          search = '',
          sort = 'updatedAt',
          sortDir = 'desc',
          status,
        },
        ctx: {
          auth: { orgId },
        },
      }) => {
        if (!orgId) {
          throw new Error('User organization not found');
        }
        const limit = parseInt(limitString);
        const page = parseInt(pageString);
        const advertisers = await db.query.advertisers.findMany({
          where: (advertisers, { eq }) =>
            eq(advertisers.clerkOrganizationId, orgId),
        });
        const data = await db.query.campaigns.findMany({
          with: { advertiser: true },
          orderBy: (campaigns, { asc, desc, sql }) => {
            if (sort === 'advertiserId') {
              const sqlQuery = sql`(select lower(name) from ${advertisersSchema} where id = ${campaigns.advertiserId})`;
              return sortDir === 'asc' ? [asc(sqlQuery)] : [desc(sqlQuery)];
            }
            if (sort === 'dailyBudget') {
              return sortDir === 'asc'
                ? [desc(campaigns['budgetType']), asc(campaigns['budget'])]
                : [asc(campaigns['budgetType']), desc(campaigns['budget'])];
            }
            if (sort === 'totalBudget') {
              return sortDir === 'asc'
                ? [asc(campaigns['budgetType']), asc(campaigns['budget'])]
                : [desc(campaigns['budgetType']), desc(campaigns['budget'])];
            }
            const sqlQuery = sql`lower(cast(${campaigns[sort]} as text))`;
            return sortDir === 'asc' ? [asc(sqlQuery)] : [desc(sqlQuery)];
          },
          where: (campaigns, { and, ilike, inArray, eq }) => {
            const campaignsWithAdvertisers = inArray(
              campaigns.advertiserId,
              advertisers.map((a) => a.id),
            );
            const campaignsWithSearch = search
              ? ilike(campaigns.name, `%${search.replace('+', ' ')}%`)
              : undefined;
            const statusFilter = status
              ? eq(campaigns.status, status)
              : undefined;
            return and(
              ...[
                campaignsWithAdvertisers,
                campaignsWithSearch,
                statusFilter,
              ].filter(Boolean),
            );
          },
          limit,
          offset: (page - 1) * limit,
        });

        const [meta] = await db
          .select({
            count: sql`count(*)`.mapWith(Number).as('count'),
          })
          .from(campaigns)
          .where(
            and(
              search
                ? ilike(campaigns.name, `%${search.replace('+', ' ')}%`)
                : undefined,
              inArray(
                campaigns.advertiserId,
                advertisers.map((a) => a.id),
              ),
              status ? eq(campaigns.status, status) : undefined,
            ),
          );

        return { data, meta };
      },
    ),
  insertCampaign: protectedOrgProcedure.input(InsertCampaignSchema).mutation(
    async ({
      input,
      ctx: {
        auth: { orgId: clerkOrganizationId },
      },
    }) => {
      if (!clerkOrganizationId) {
        throw new Error('User organization not found');
      }
      return db.insert(campaigns).values(input).returning();
    },
  ),
  updateCampaign: protectedOrgProcedure
    .input(InsertCampaignSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { altId, id, updatedAt, createdAt, ...campaignData } = input;
      return db
        .update(campaigns)
        .set(campaignData)
        .where(eq(campaigns.id, input.id))
        .returning();
    }),
  cloneCampaign: protectedOrgProcedure
    .input(
      z.object({ cloneData: InsertCampaignSchema, originalId: z.string() }),
    )
    .mutation(async ({ input }) => {
      // TODO: Experiment with transactions to ensure that the clone is atomic -- needs pool/websocket connection to neon
      const { altId, id, updatedAt, createdAt, ...campaignData } =
        input.cloneData;
      const [newCampaign] = await db
        .insert(campaigns)
        .values(campaignData)
        .returning();

      const campaignTargetingGroups = await db.query.targetingGroups.findMany({
        where: (targetingGorups, { eq }) =>
          eq(targetingGorups.campaignId, input.originalId),
      });

      let newTargetingGroups: TargetingGroup[] = [];

      if (campaignTargetingGroups.length) {
        newTargetingGroups = await db
          .insert(targetingGroups)
          .values(
            campaignTargetingGroups.map(
              ({ campaignId, id, altId, beeswaxSync, ...tg }) => ({
                ...tg,
                campaignId: newCampaign.id,
              }),
            ),
          )
          .returning();
      }
      return {
        campaign: newCampaign,
        targetingGroups: newTargetingGroups,
      };
    }),
  deleteCampaign: protectedOrgProcedure.input(z.string()).mutation(
    async ({
      input,
      ctx: {
        auth: { userId },
      },
    }) => {
      const campaignData = await db.query.campaigns.findMany({
        with: { advertiser: true },
        where: (campaigns, { eq }) => {
          return eq(campaigns.id, input);
        },
      });

      if (!campaignData.length || !campaignData[0].id) {
        throw new Error('Campaign not found');
      }

      const snapshot = JSON.stringify(campaignData[0]);

      const deletion = await db
        .insert(deletions)
        .values({
          objectType: 'campaign',
          objectId: input,
          data: snapshot,
          deletedBy: userId,
        })
        .returning();

      if (!deletion || !deletion[0].id) {
        throw new Error('Failed to save campaign snapshot');
      }

      return db.delete(campaigns).where(eq(campaigns.id, input)).returning({
        id: campaigns.id,
        externalId: campaigns.externalId,
        name: campaigns.name,
        advertiserId: campaigns.advertiserId,
      });
    },
  ),
  // Placeholder for future implementation
  // May want to move into a reporting-specific router
  getCampaignStats: protectedOrgProcedure.query(
    async (): Promise<ReturnType<typeof formatStats>> => {
      const data = STATS;
      return new Promise((resolve) =>
        setTimeout(() => resolve(formatStats(data)), 1000),
      );
    },
  ),
});

// --------------------------------------------------
// Helper Functions
// --------------------------------------------------

function formatStats(stats: typeof STATS): {
  dimension: string;
  value: string;
  change: string;
  isPositive: boolean;
  tooltip: string;
}[] {
  return stats.map((stat) => {
    let value = `${stat.value}`;
    if (stat.value_type === 'currency') {
      value = formatCurrency({ number: stat.value });
    }
    if (stat.value_type === 'number') {
      value = formatLargeNumber({ number: stat.value });
    }
    const isPositive = stat.change >= 0;
    const change = formatPercentage({ number: Math.abs(stat.change) });
    return {
      dimension: capitalize(stat.dimension),
      value,
      isPositive,
      change,
      tooltip: stat.description,
    };
  });
}
