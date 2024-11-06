'use server';

import {
  InsertCampaignSchema,
  InsertTargetingGroupSchema,
} from '@limelight/shared-drizzle';
import { api } from '../trpc/server';
import {
  PossibleDimensions,
  PossibleReportFields,
  ReportingData,
} from './api/routers/tinybird';
import { db } from './db';
import { z, ZodIssue } from 'zod';
import { addDays, differenceInDays, isBefore } from 'date-fns';
import { formatCurrency } from '@limelight/shared-utils/index';

export async function getStripeCustomerIdOfOrganization({
  organizationId,
}: {
  organizationId: string;
}) {
  const results = await db.query.organizations.findFirst({
    columns: {
      id: true,
      stripeCustomerId: true,
    },

    where: (model, { eq, and }) => and(eq(model.id, organizationId)),
  });

  return results?.stripeCustomerId;
}

export async function getRemainingBudget(payload: {
  campaignId: string;
  budget: number;
  currentTgId?: string;
}) {
  const remainingBudget = await api.targetingGroups.getRemainingBudget.query(
    payload,
  );
  return remainingBudget;
}

export async function getFrequencyAverages(payload: {
  id: string;
  startDate: string;
  endDate: string;
  timezone: string;
}) {
  const frequencyBuckets = await api.tinybird.reports.frequencyBucket.mutate(
    payload,
  );

  // Calculate average frequency
  const frequencyBucketsData = frequencyBuckets.data;
  let totalReach = 0;
  let totalImpressions = 0;

  frequencyBucketsData.forEach(
    (bucket: { frequency_bucket: string; reach: number }) => {
      const impressions = parseInt(bucket.frequency_bucket, 10) * bucket.reach; // Default to 10 for '10+'
      totalImpressions += impressions;
      totalReach += bucket.reach;
    },
  );

  let averageFrequency = 0;
  if (totalImpressions > 0 && totalReach > 0) {
    averageFrequency = totalImpressions / totalReach;
  } else {
    averageFrequency = 0; // Handle no valid data
  }

  return { averageFrequency, frequencyBuckets };
}

const MAX_LINES = 5;

export async function getLines(_payload: {
  id: string;
  additionalDimensions: PossibleDimensions;
  startDate: string;
  endDate: string;
  km: PossibleReportFields;
  timezone: string;
}) {
  const { km, ...payload } = _payload;
  const timeSeries = await api.tinybird.reports.campaignByDimension.mutate({
    ...payload,
    sort: `-${km}`,
  });

  const _lineNames = await api.tinybird.reports.campaignByDimension.mutate({
    ...payload,
    dimension: payload.additionalDimensions,
    additionalDimensions: undefined,
    limit: MAX_LINES,
    sort: '-impressions',
  });

  const lineNames =
    payload.additionalDimensions === 'impression_date'
      ? ['impression_date']
      : _lineNames.data.map((line) => `${line[payload.additionalDimensions]}`);

  const { lines } = await _getLines({
    report: timeSeries,
    dimension: 'impression_date',
    valueKey: payload.additionalDimensions,
    keyMetric: km,
    lineNames,
  });
  return { lines, lineNames };
}

async function _getLines<
  T extends PossibleDimensions,
  D extends PossibleDimensions,
>({
  report,
  dimension,
  valueKey,
  keyMetric,
  lineNames,
}: {
  report: ReportingData<T | D>;
  dimension: D;
  valueKey: T;
  keyMetric: PossibleReportFields;
  lineNames: string[];
}) {
  const linesObject: Partial<
    Record<string, ReportingData<T | D>['data'][number][]>
  > = Object.fromEntries(lineNames.map((lineName) => [lineName, []]));

  if (valueKey === 'impression_date') {
    linesObject[valueKey] = report.data;
  } else {
    report.data.forEach((timeSeries) => {
      const key = timeSeries[valueKey];
      if (key in linesObject) {
        if (Array.isArray(linesObject[key])) {
          linesObject[key].push(timeSeries);
        }
      }
    });
  }

  const lines: (ReportingData<T | D>['data'][number] &
    Record<(typeof lineNames)[number], number>)[] = [];

  if (valueKey === 'impression_date') {
    lines.push(...(report.data as (typeof lines)[number][]));
  } else {
    const dateMap: Partial<Record<D, number>> = {};

    lineNames.forEach((lineName) => {
      const datalist = linesObject[lineName as keyof typeof linesObject];
      datalist?.forEach((data) => {
        const date = data[dimension];
        if (date in dateMap) {
          const idx = dateMap[date as D];
          if (typeof idx === 'number') {
            const line = lines[idx];
            line[lineName as keyof typeof line] = data[
              keyMetric
            ] as (typeof line)[keyof typeof line];
          }
        } else {
          lines.push({
            ...data,
            [lineName as keyof (typeof lines)[number]]: data[
              keyMetric
            ] as number,
          });
          dateMap[date as D] = lines.length - 1;
        }
      });
    });
  }
  return { lines, lineNames };
}

export async function checkValidity(
  payload: { campaignId: string },
  options?: { includeTargetingGroups?: boolean; includeCampaign?: boolean },
) {
  const { includeTargetingGroups = true, includeCampaign = true } =
    options ?? {};

  let targetingGroups: Awaited<
    ReturnType<typeof api.targetingGroups.getTargetingGroups.query>
  > = [];

  let [campaign]: Awaited<ReturnType<typeof api.campaigns.getCampaign.query>> =
    [];

  [campaign] = await api.campaigns.getCampaign.query({
    id: payload.campaignId,
  });

  if (includeTargetingGroups) {
    targetingGroups = await api.targetingGroups.getTargetingGroups.query({
      campaignId: payload.campaignId,
    });
  }

  const validCampaignSchema = InsertCampaignSchema.superRefine(
    (
      { pixelId, objective, budgetType, budget, startDate, endDate, status },
      refinementContext,
    ) => {
      if (objective === 'retargeting' && !pixelId) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pixel is required for retargeting objective',
          path: ['pixelId'],
        });
      }
      if (budgetType === 'daily' && budget < 50) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Minimum daily budget for daily campaigns is $50',
          path: ['budget'],
        });
      }
      const days = Math.abs(differenceInDays(startDate, endDate)) || 1;

      if (budgetType === 'lifetime') {
        if (objective === 'retargeting') {
          if (budget < 100) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Minimum budget for a retargeting campaign is $100`,
              path: ['budget'],
            });
          }
          if (budget > 1000) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Maximum budget for a retargeting campaign is $1000`,
              path: ['budget'],
            });
          }
        } else if (budget / days < 50) {
          refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Minimum budget for a ${days} day campaign is ${formatCurrency(
              { number: 50 * days },
            )}`,
            path: ['budget'],
          });
        }
      }
      if (isBefore(startDate, addDays(new Date(), 1)) && status === 'draft') {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date must be at least 1 day in the future',
          path: ['startDate'],
        });
      }
      if (isBefore(endDate, startDate)) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date must be after start date',
          path: ['endDate'],
        });
      }
      if (
        objective === 'retargeting' &&
        differenceInDays(endDate, startDate) !== 30
      ) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Retargeting Campaigns must be 30 days long',
          path: ['endDate'],
        });
      }
      const minDays = objective === 'retargeting' ? -Infinity : 3;
      if (differenceInDays(endDate, startDate) < minDays) {
        refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${
            objective === 'retargeting' ? 'Retargeting Campaigns' : 'Campaign'
          } must be at least ${minDays} days long`,
          path: ['endDate'],
        });
      }
    },
  );

  const validTargetingGroupT = InsertTargetingGroupSchema.superRefine(
    (args, ctx) => {
      if (campaign.objective !== 'retargeting' && args.budget < 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Daily targeting group budget must be at least $50',
          path: ['budget'],
        });
      }
      if (args.geoZipCodes?.length) {
        const isValid = args.geoZipCodes.every(
          (zip) => zip.length === 5 && zip.match(/\d{5}$/),
        );
        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Please enter valid 5-digit zip codes in a comma-separated list',
            path: ['geoZipCodes'],
          });
        }
      }
    },
  );

  let campaignErrors: ZodIssue[] = [];
  const targetingGroupErrors: Record<string, ZodIssue[]> = {};

  let isValid = false;

  if (includeCampaign) {
    const validCampaign = validCampaignSchema.safeParse(campaign);
    if (validCampaign.error) {
      campaignErrors = validCampaign.error.errors;
    }
    if (validCampaign.success) {
      isValid = true;
    }
  }

  if (includeTargetingGroups) {
    if (
      targetingGroups.length ||
      !(campaign.objective === 'retargeting' && targetingGroups.length > 1)
    ) {
      targetingGroups.forEach((tg) => {
        const result = validTargetingGroupT.safeParse(tg);
        if (!result.success) {
          isValid = false;
        }
        if (result.error) {
          targetingGroupErrors[tg.id] = result.error.errors;
        }
      });
    } else {
      isValid = false;
    }
  }

  return {
    isValid,
    campaignErrors,
    targetingGroupErrors,
    campaign,
    targetingGroups,
  };
}

export async function getTargetingGroupRedirectUrl(payload: {
  campaignId: string;
  currentTgId?: string;
}) {
  const nextTgId = await api.targetingGroups.getNextTargetingGroupId.query(
    payload,
  );
  if (!nextTgId) {
    return null;
  }
  return `/campaigns/${payload.campaignId}/targeting-groups/${nextTgId}/edit`;
}
