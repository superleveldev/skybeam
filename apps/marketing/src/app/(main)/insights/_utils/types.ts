import { api } from '../../../../trpc/server';

export type DmaStateLookup = Awaited<
  ReturnType<typeof api.impressionForecaster.dmaStateLookup.query>
>;

export type ForecastImpactResults = Awaited<
  ReturnType<typeof api.impressionForecaster.forecastImpact.query>
>;
