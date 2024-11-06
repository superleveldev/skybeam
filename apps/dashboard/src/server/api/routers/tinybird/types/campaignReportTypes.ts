export const dimensions = [
  'impression_date',
  'hour_of_day',
  'day_of_week',
  'daypart',
  'app_bundle',
  'app_name',
  'creative_name',
  'creative_duration',
  'zip_code',
  'targeting_group_name',
  'campaign_id',
  'frequency_bucket',
] as const;

export const reportFields = [
  'impressions',
  'reach',
  'cpm',
  'cpr',
  'spend_usd',
] as const;

export type PossibleReportFields = (typeof reportFields)[number];

export type PossibleDimensions = (typeof dimensions)[number];

export type ReportingData<T extends PossibleDimensions> = {
  meta: { name: PossibleReportFields | T; type: string }[];
  data: Record<PossibleReportFields | T, string | number>[];
  rows: number;
  statistics: {
    elapsed: number;
    rows_read: number;
    bytes_read: number;
  };
};
