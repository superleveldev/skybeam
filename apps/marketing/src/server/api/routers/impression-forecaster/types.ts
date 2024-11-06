import dmaSizePercent from './dma_size_percent.json';
import dmaStateLookup from './dma_state_lookup.json';
import audiences from './audiences.json';

export type DmaSizePercentResponse = typeof dmaSizePercent;
export type DmaStateLookupResponse = typeof dmaStateLookup;
export type AudiencesResponse = typeof audiences;

export type DmaSizePercent = {
  zip_code: string;
  state: string;
  dma_name: string;
  county_name: string;
  size: number;
  size_percent: number;
};
export type DmaStateLookup = {
  dma_name: string;
  state: string;
};

export type DmaSizePercentData = {
  data: DmaSizePercent[];
};
export type DmaStateLookupData = {
  data: DmaStateLookup[];
};

export type Audiences = AudiencesResponse['data'];

export type ForecastResults = {
  estimatedAudienceSize: { lower_end: number; higher_end: number };
  forecastedImpressions: { lower_end: number; higher_end: number };
  websiteVisits: { lower_end: number; higher_end: number };
  incrementalClicks: {
    search: { lower_end: number; higher_end: number };
    social: { lower_end: number; higher_end: number };
  };
};

export type Range = { lower_end: number; higher_end: number };
