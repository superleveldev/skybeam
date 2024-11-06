import { aboutRouter } from './routers/about';
import { createTRPCRouter } from './trpc';
import { resourcesRouter } from './routers/resources';
import { impressionForecasterRouter } from './routers/impression-forecaster/impression-forecaster';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  about: aboutRouter,
  resources: resourcesRouter,
  impressionForecaster: impressionForecasterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
