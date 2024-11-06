import { z } from 'zod';
import { createTRPCRouter, protectedOrgProcedure } from '../../trpc';
import {
  fetchTinyBird,
  inputToQueryParams,
  TinyBirdJSONResponse,
} from './index';

const basePath = '/v0/pipes/skybeam_beeswax_cities';

interface GeoTargeting {
  id: number;
  metro_code: string;
  name: string;
  region_code: string;
  region_name: string;
  geoname: string;
  country_code_2: string;
  country_code_3: string;
}

export const geoTargetingsRouter = createTRPCRouter({
  all: protectedOrgProcedure
    .input(
      z.object({
        ids: z.string().optional(),
        geonames: z.string().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const queryParameters = inputToQueryParams(input);

      const response = await fetchTinyBird(
        `${basePath}.json?${queryParameters}`,
      );
      const json: TinyBirdJSONResponse = await response.json();
      const targetings: GeoTargeting[] = json.data;
      return targetings;
    }),
});
