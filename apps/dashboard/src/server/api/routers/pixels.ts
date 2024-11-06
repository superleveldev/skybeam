import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import { db } from '../../db';
import { advertiserPixels } from '@limelight/shared-drizzle';
import { env } from '../../../env';

export const pixelsRouter = createTRPCRouter({
  getPixels: protectedOrgProcedure
    .input(
      z.object({
        advertiserId: z.string(),
      }),
    )
    .query(async ({ input: { advertiserId } }) => {
      return db.query.advertisers.findFirst({
        where: (advertisers, { eq }) => eq(advertisers.id, advertiserId),
        with: { pixels: true },
        columns: {},
      });
    }),
  assignPixel: protectedOrgProcedure
    .input(
      z.object({
        name: z.string(),
        advertiserId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const environment = env.BRANCH === 'main' ? 'production' : 'development';
      const availablePixel = await db.query.advertiserPixels.findFirst({
        where: (pixels, { isNull, and, eq }) =>
          and(isNull(pixels.advertiserId), eq(pixels.environment, environment)),
      });
      if (!availablePixel) {
        throw new Error('No available pixels');
        // TODO: Trigger panic message to kate!
      }
      const [nextPixel] = await db
        .update(advertiserPixels)
        .set(input)
        .where(eq(advertiserPixels.id, availablePixel.id))
        .returning({ id: advertiserPixels.id });
      return nextPixel;
    }),
});
