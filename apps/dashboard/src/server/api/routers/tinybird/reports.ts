import { z } from 'zod';
import { createTRPCRouter, protectedOrgProcedure } from '../../trpc';
import { postTinyBird, TinyBirdJSONResponse } from './index';
import { dimensions, ReportingData } from './types/campaignReportTypes';
import { TRPCClientError } from '@trpc/client';

import { db } from '../../../db';
import { eq } from 'drizzle-orm';
import { campaigns } from '@limelight/shared-drizzle';

const campaignReportsPath = '/v0/pipes/api_campaign_delivery_reports';
const frequencyBucketsReportsPath = '/v0/pipes/api_campaign_frequency_buckets';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const requiredInputforCampaigns = z.object({
  organizationId: z.string().min(1),
});

const requiredInputs = z.object({
  campaignId: z.string().min(1),
  organizationId: z.string().min(1),
  startDate: z
    .string()
    .refine((d) => d.match(dateRegex) && !isNaN(Date.parse(d)))
    .optional(),
  endDate: z
    .string()
    .refine((d) => d.match(dateRegex) && !isNaN(Date.parse(d)))
    .optional(),
  timezone: z.string().optional(),
  dimensions: z.string(),
  sortBy: z.string().optional(),
  sortByDirection: z.union([z.literal('asc'), z.literal('desc')]).optional(),
  limit: z.number().optional(),
});

const requiredInputsGorFrequencyBucket = z.object({
  campaignId: z.string().min(1),
  organizationId: z.string().min(1),
  startDate: z
    .string()
    .refine((d) => d.match(dateRegex) && !isNaN(Date.parse(d)))
    .optional(),
  endDate: z
    .string()
    .refine((d) => d.match(dateRegex) && !isNaN(Date.parse(d)))
    .optional(),
  timezone: z.string().optional(),
  sortBy: z.string().optional(),
  sortByDirection: z.union([z.literal('asc'), z.literal('desc')]).optional(),
});

export const reportsRouter = createTRPCRouter({
  customReport: protectedOrgProcedure
    .input(requiredInputs)
    .mutation(async ({ input }) => {
      const body = requiredInputs.parse(input);
      const response = await postTinyBird(`${campaignReportsPath}.json`, body);
      const json: TinyBirdJSONResponse = await response.json();
      const data = json.data;
      return data;
    }),
  campaignsByOrganization: protectedOrgProcedure.query(
    async ({
      ctx: {
        auth: { orgId },
      },
    }) => {
      const body = requiredInputforCampaigns.parse({
        organizationId: orgId,
      });

      const response = await postTinyBird(`${campaignReportsPath}.json`, body);
      const data = await response.json();
      return data;
    },
  ),
  campaignByDimension: protectedOrgProcedure
    .input(
      z.object({
        id: z.string(),
        dimension: z.enum(dimensions).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        timezone: z.string().optional(),
        additionalDimensions: z.string().optional(),
        sort: z.string().optional(),
        limit: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        id,
        dimension = 'impression_date',
        startDate: _startDate,
        endDate: _endDate,
        timezone,
        additionalDimensions,
        sort: _sort,
        limit,
      } = input;

      const sort = _sort ?? dimension;
      const sortBy = sort?.startsWith('-') ? sort.slice(1) : sort;
      const sortByDirection = sort?.startsWith('-') ? 'desc' : 'asc';

      // Validate campaign existence
      const campaign = await db.query.campaigns.findFirst({
        with: { advertiser: true },
        where: eq(campaigns.id, id),
      });

      // Set start and end dates, falling back to campaign dates if necessary
      const startDate = _startDate ? new Date(_startDate) : campaign?.startDate;
      const endDate = _endDate ? new Date(_endDate) : campaign?.endDate;

      if (!startDate || isNaN(startDate.getTime())) {
        throw new TRPCClientError('Invalid start date');
      }
      if (!endDate || isNaN(endDate.getTime())) {
        throw new TRPCClientError('Invalid end date');
      }

      const startDateISO = startDate.toISOString().split('T')[0];
      const endDateISO = endDate.toISOString().split('T')[0];

      if (campaign) {
        const body = requiredInputs.parse({
          campaignId: campaign.id,
          organizationId: campaign.advertiser.clerkOrganizationId,
          timezone: timezone ?? 'US/Eastern',
          dimensions: [dimension, additionalDimensions]
            .filter(Boolean)
            .join(','),
          startDate: startDateISO,
          endDate: endDateISO,
          sortBy,
          sortByDirection,
          limit,
        });

        const response = await postTinyBird(
          `${campaignReportsPath}.json`,
          body,
        );
        const json = await response.json();
        const data = json;
        return data as ReportingData<typeof dimension>;
      } else {
        throw new TRPCClientError('Campaign not found');
      }
    }),
  frequencyBucket: protectedOrgProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        timezone: z.string().optional(),
        sortBy: z.string().optional(),
        sortByDirection: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        id,
        startDate: _startDate,
        endDate: _endDate,
        timezone,
        sortBy,
        sortByDirection,
      } = input;

      // Validate campaign existence
      const campaign = await db.query.campaigns.findFirst({
        with: { advertiser: true },
        where: eq(campaigns.id, id),
      });

      // Set start and end dates, falling back to campaign dates if necessary
      const startDate = _startDate ? new Date(_startDate) : campaign?.startDate;
      const endDate = _endDate ? new Date(_endDate) : campaign?.endDate;

      if (!startDate || isNaN(startDate.getTime())) {
        throw new TRPCClientError('Invalid start date');
      }
      if (!endDate || isNaN(endDate.getTime())) {
        throw new TRPCClientError('Invalid end date');
      }

      const startDateISO = startDate.toISOString().split('T')[0];
      const endDateISO = endDate.toISOString().split('T')[0];

      if (campaign) {
        const body = requiredInputsGorFrequencyBucket.parse({
          campaignId: campaign.id,
          organizationId: campaign.advertiser.clerkOrganizationId,
          timezone: timezone ?? 'US/Eastern',
          startDate: startDateISO,
          endDate: endDateISO,
          sortBy: sortBy ?? 'reach',
          sortByDirection: sortByDirection ?? 'desc',
        });

        const response = await postTinyBird(
          `${frequencyBucketsReportsPath}.json`,
          body,
        );
        const json = await response.json();
        return json;
      } else {
        throw new TRPCClientError('Campaign not found');
      }
    }),
});
