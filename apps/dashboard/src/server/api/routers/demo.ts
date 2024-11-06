import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const demoRouter = createTRPCRouter({
  demoThingOne: protectedProcedure
    .input(
      z.object({
        entityId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return `Example with entityId: ${input.entityId}`;
    }),
});
