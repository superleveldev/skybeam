import { createTRPCRouter } from './trpc';
import { demoRouter } from './routers/demo';
import { campaignsRouter } from './routers/campaigns';
import { advertisersRouter } from './routers/advertisers';
import { TargetingGroupsRouter } from './routers/targeting-groups';
import { targetingGroupCreativesRouter } from './routers/targeting-group-creatives';
import { inventoriesRouter } from './routers/inventories';
import { organizationsRouter } from './routers/organizations';
import { pixelsRouter } from './routers/pixels';
import { usersRouter } from './routers/users';
import { tinyBirdRouter } from './routers/tinybird';
import { creativesRouter } from './routers/creatives';
import { stripeRouter } from './routers/stripe';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  demo: demoRouter,
  organizations: organizationsRouter,
  users: usersRouter,
  campaigns: campaignsRouter,
  advertisers: advertisersRouter,
  targetingGroups: TargetingGroupsRouter,
  targetingGroupCreatives: targetingGroupCreativesRouter,
  pixels: pixelsRouter,
  tinybird: tinyBirdRouter,
  creatives: creativesRouter,
  stripe: stripeRouter,
  inventories: inventoriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
