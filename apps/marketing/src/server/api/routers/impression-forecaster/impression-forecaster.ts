import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import dmaSizePercent from './dma_size_percent.json';
import dmaStateLookup from './dma_state_lookup.json';
import audiences from './audiences.json';
import { forecast } from './utils';

import { DmaSizePercentData, DmaStateLookupData } from './types';

const dmaSizePercentData = (dmaSizePercent as DmaSizePercentData).data;
const dmaStateLookupData = (dmaStateLookup as DmaStateLookupData).data;

export const impressionForecasterRouter = createTRPCRouter({
  audience: publicProcedure.query(async () => {
    return audiences.data;
  }),
  dmaSizePercent: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        search: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      return (
        (input?.search &&
          dmaSizePercentData.filter((item) =>
            input?.search?.some((dmaName) => item.dma_name.includes(dmaName)),
          )) ??
        []
      );
    }),
  dmaStateLookup: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        search: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const searchResult =
        (input?.search &&
          dmaStateLookupData.filter((item) =>
            item.dma_name
              .toLocaleLowerCase()
              .includes(input.search.toLocaleLowerCase()),
          )) ||
        [];
      return searchResult;
    }),
  forecastImpact: publicProcedure
    .input(
      z.object({
        audienceName: z.string().optional(),
        budget: z.number(),
        locations: z.array(z.string()),
      }),
    )
    .query(({ input }) => {
      return forecast({
        audiences: audiences.data,
        audienceName: input.audienceName,
        stateLookup: input.locations.length
          ? input.locations
          : dmaStateLookupData.map((item) => item.dma_name),
        sizePercent: dmaSizePercentData,
        budget: input.budget,
      });
    }),
});
