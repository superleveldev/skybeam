import { TRPCError } from '@trpc/server';
import { mapKeys, snakeCase } from 'lodash';

import { createTRPCRouter } from '../../trpc';
import { env } from '../../../../../src/env';

import { advertiserCategoriesRouter } from './advertiser-categories';
import { geoTargetingsRouter } from './geo-targetings';
import { targetingSegmentsRouter } from './targeting-segments';
import { reportsRouter } from './reports';

interface Column {
  name: string;
  type: string;
}

export interface TinyBirdJSONResponse {
  meta: Column[];
  data: [];
}

export function inputToQueryParams(input: object): string {
  const key_values = Object.entries(input).reduce(
    (agg: string[], [k, v]) => (v ? agg.concat([`${k}=${v}`]) : agg),
    [],
  );
  return key_values.join('&');
}

export function fetchTinyBird(url: string): Promise<Response> {
  return fetch(env.TINYBIRD_BASE_URL + url, {
    headers: {
      Authorization: `Bearer ${env.TINYBIRD_TOKEN}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res;
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong - ${res.status}`,
      });
    }
  });
}

export function postTinyBird(
  url: string,
  body: object,
  headers: object = {},
): Promise<Response> {
  const snakeCaseBody = mapKeys(body, (_k, v) => snakeCase(v));
  return fetch(env.TINYBIRD_BASE_URL + url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TINYBIRD_TOKEN}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(snakeCaseBody),
  }).then((res) => {
    if (res.ok) {
      return res;
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong - ${res.status}`,
      });
    }
  });
}

export const tinyBirdRouter = createTRPCRouter({
  geoTargetings: geoTargetingsRouter,
  advertiserCategories: advertiserCategoriesRouter,
  targetingSegments: targetingSegmentsRouter,
  reports: reportsRouter,
});

export * from './reports';
export * from './types/campaignReportTypes';
