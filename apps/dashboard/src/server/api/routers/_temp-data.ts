export const STATS = [
  {
    dimension: 'impressions',
    value: 400_123,
    change: 0.345,
    value_type: 'number',
    description:
      'Every time your ad is shown on a TV screen, that’s an impression. Watch your brand grow with every view!',
  },
  {
    dimension: 'money spent',
    value: 1_545_234,
    value_type: 'currency',
    change: 0.345,
    description:
      'Keep track of your spend. It’s all about maximizing every dollar for the best return!',
  },
  {
    dimension: 'new campaigns',
    value: 5,
    value_type: 'number',
    change: -0.16,
    description:
      'Track the number of campaigns you’ve launched. More campaigns mean more opportunities for growth!',
  },
];

export const REPORT_RESPONSE = {
  meta: [
    {
      name: 'impression_date',
      type: 'Date',
    },
    {
      name: 'hour_of_day',
      type: 'UInt8',
    },
    {
      name: 'impressions',
      type: 'UInt64',
    },
    {
      name: 'reach',
      type: 'UInt64',
    },
    {
      name: 'spend_usd',
      type: 'Float64',
    },
    {
      name: 'cpm',
      type: 'Float64',
    },
    {
      name: 'cpr',
      type: 'Float64',
    },
  ],

  data: [
    {
      impression_date: '2024-09-30',
      impressions: 16745,
      reach: 8763,
      spend_usd: 802.4474074999627,
      cpm: 47.92,
      cpr: 0.09,
    },
    {
      impression_date: '2024-10-01',
      impressions: 21747,
      reach: 10293,
      spend_usd: 1048.5223874998612,
      cpm: 48.21,
      cpr: 0.1,
    },
    {
      impression_date: '2024-10-02',
      impressions: 4471,
      reach: 2969,
      spend_usd: 230.49852500000992,
      cpm: 51.55,
      cpr: 0.08,
    },
    {
      impression_date: '2024-10-03',
      impressions: 697,
      reach: 429,
      spend_usd: 37.99180249999952,
      cpm: 54.51,
      cpr: 0.09,
    },
    {
      impression_date: '2024-10-04',
      impressions: 294,
      reach: 159,
      spend_usd: 16.67857000000017,
      cpm: 56.73,
      cpr: 0.1,
    },
    {
      impression_date: '2024-10-05',
      impressions: 96,
      reach: 58,
      spend_usd: 5.46718999999999,
      cpm: 56.95,
      cpr: 0.09,
    },
    {
      impression_date: '2024-10-06',
      impressions: 16,
      reach: 15,
      spend_usd: 0.8917300000000002,
      cpm: 55.73,
      cpr: 0.06,
    },
    {
      impression_date: '2024-10-07',
      impressions: 5,
      reach: 3,
      spend_usd: 0.23701250000000001,
      cpm: 47.4,
      cpr: 0.08,
    },
  ],

  rows: 8,

  statistics: {
    elapsed: 0.030330522,
    rows_read: 77550,
    bytes_read: 11042468,
  },
};
