'use server';
import { api } from '../../../../trpc/server';

export async function forecastImpact(input: {
  audienceName?: string;
  budget: number;
  locations: string[];
}) {
  return api.impressionForecaster.forecastImpact.query(input);
}
