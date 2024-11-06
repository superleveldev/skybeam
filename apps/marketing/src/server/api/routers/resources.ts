import {
  getResource,
  getResourceMetaData,
  getResources,
  getResourcesPage,
} from '../../queries';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

export const resourcesRouter = createTRPCRouter({
  // Leaving as example for now
  // demoThingOne: publicProcedure
  //   .input(
  //     z.object({
  //       entityId: z.number(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     return `Example with entityId: ${input.entityId}`;
  //   }),
  getResource: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const resource = await getResource(input);
      return resource;
    }),
  getResourceMetaData: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const metaData = await getResourceMetaData(input);
      return metaData;
    }),
  getResourcesByCategory: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const resources = await getResources(input.category);
      return resources;
    }),
  getResourcesPageConfig: publicProcedure.query(async () => {
    const config = await getResourcesPage();
    return config;
  }),
});
