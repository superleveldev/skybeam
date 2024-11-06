import { createTRPCRouter, protectedOrgProcedure } from '../trpc';
import { env } from '../../../env';
import { db } from '../../db';
import { environmentEnum, optionsInventories } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';

export const inventoriesRouter = createTRPCRouter({
  getInventories: protectedOrgProcedure.query(async () => {
    let environment: (typeof environmentEnum.enumValues)[number] = 'dev';
    if (env.VERCEL_ENV === 'production') {
      environment = 'prod';
    }

    return db
      .select({
        name: optionsInventories.name,
        listName: optionsInventories.listName,
        beeswaxListId: optionsInventories.beeswaxListId,
        environment: optionsInventories.environment,
      })
      .from(optionsInventories)
      .where(eq(optionsInventories.environment, environment));
  }),
});
