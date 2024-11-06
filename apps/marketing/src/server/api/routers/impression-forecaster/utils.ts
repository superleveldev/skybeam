import { Audiences, DmaSizePercent, ForecastResults, Range } from './types';

function calculateAudienceSize(
  audienceSize: number,
  sizePercent: DmaSizePercent[],
): { lower_end: number; higher_end: number } {
  const totalPercent = sizePercent.reduce(
    (acc, location) => acc + (location?.size_percent ?? 0),
    0,
  );

  const base = (audienceSize * totalPercent) / 100;

  return {
    lower_end: Math.round(base * 0.95),
    higher_end: Math.round(base * 1.05),
  };
}

function forecastImpressions(budget: number): Range {
  return {
    lower_end: Math.round((budget / 30) * 1000),
    higher_end: Math.round((budget / 18) * 1000),
  };
}

function websiteVisits(impressions: Range): Range {
  return {
    lower_end: Math.round(impressions.lower_end * 0.0063),
    higher_end: Math.round(impressions.higher_end * 0.0129),
  };
}

function incrementalClicks(
  impressions: Range,
  type: 'search' | 'social',
): Range {
  const rates = type === 'search' ? [0.012, 0.021] : [0.0047, 0.0161];
  return {
    lower_end: Math.round(impressions.lower_end * rates[0]),
    higher_end: Math.round(impressions.higher_end * rates[1]),
  };
}

function forecast({
  audienceName,
  audiences,
  stateLookup,
  sizePercent,
  budget,
}: {
  audienceName?: string;
  audiences: Audiences;
  stateLookup: string[];
  sizePercent: DmaSizePercent[];
  budget: number;
}): ForecastResults {
  const audienceSize = audienceName
    ? audiences.find((audience) => audience.name === audienceName)?.audience ||
      0
    : audiences.reduce((total, audience) => total + audience.audience, 0);

  const locationPercentages = sizePercent.filter((percentage) =>
    stateLookup.includes(percentage.dma_name),
  );
  const uniqueLocationPercentages = Array.from(
    new Map(locationPercentages.map((item) => [item.zip_code, item])).values(),
  );

  const estimatedAudienceSize = calculateAudienceSize(
    audienceSize,
    uniqueLocationPercentages,
  );
  const forecastedImpressions = forecastImpressions(budget);
  const searchClicks = incrementalClicks(forecastedImpressions, 'search');
  const socialClicks = incrementalClicks(forecastedImpressions, 'social');
  const websiteVisitsRange = websiteVisits(forecastedImpressions);

  return {
    estimatedAudienceSize,
    forecastedImpressions,
    websiteVisits: websiteVisitsRange,
    incrementalClicks: {
      search: searchClicks,
      social: socialClicks,
    },
  };
}
export { forecast };
