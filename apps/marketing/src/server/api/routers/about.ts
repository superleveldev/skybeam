import { getOurTeam } from '../../queries';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const aboutRouter = createTRPCRouter({
  getOurTeam: publicProcedure.query(async () => {
    const ourTeam = await getOurTeam();
    return ourTeam;
  }),
});
