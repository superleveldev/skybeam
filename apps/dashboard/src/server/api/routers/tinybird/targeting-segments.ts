import { z } from 'zod';
import { createTRPCRouter, protectedOrgProcedure } from '../../trpc';
import {
  fetchTinyBird,
  inputToQueryParams,
  TinyBirdJSONResponse,
} from './index';
import { env } from '../../../../../src/env';

export const basePath = env.TARGETING_SEGMENTS_BASE_PATH;

export interface TargetingSegment {
  attribute_uuid: string;
  name: string;
  beeswax_segment_id: string;
  beeswax_segment_count: number;
  category: string;
  classification: string;
  cpm: number;
  vendor_id: string;
  vendor_name: string;
}

export const targetingSegmentsRouter = createTRPCRouter({
  all: protectedOrgProcedure
    .input(
      z.object({
        name: z.string().optional(),
        classification: z.string().optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const queryParameters = inputToQueryParams(input);

      const response = await fetchTinyBird(
        `${basePath}.json?${queryParameters}`,
      );
      const json: TinyBirdJSONResponse = await response.json();
      const targetings: TargetingSegment[] = json.data;
      return targetings;
    }),
});
