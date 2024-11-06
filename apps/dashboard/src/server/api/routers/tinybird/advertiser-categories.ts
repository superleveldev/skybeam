import { z } from 'zod';
import { createTRPCRouter, protectedOrgProcedure } from '../../trpc';
import {
  fetchTinyBird,
  inputToQueryParams,
  TinyBirdJSONResponse,
} from './index';

const basePath = '/v0/pipes/skybeam_beeswax_advertiser_categories';

interface AdvertiserCategory {
  key: string;
  name: string;
}

export const advertiserCategoriesRouter = createTRPCRouter({
  all: protectedOrgProcedure
    .input(
      z.object({
        name: z.string().optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const queryParameters = inputToQueryParams(input);

      const response = await fetchTinyBird(
        `${basePath}.json?${queryParameters}`,
      );
      const json: TinyBirdJSONResponse = await response.json();
      const targetings: AdvertiserCategory[] = json.data;
      return targetings;
    }),
});
