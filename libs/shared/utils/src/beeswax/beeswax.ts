// --------------------------------------------------
// API Responses
// --------------------------------------------------

/**
 * Formats alt ID for beeswax API
 */
export function padAltId(altId: number, prefix = 'skybeam'): string {
  return `${prefix}-${altId.toString().padStart(7, '0')}`;
}

export interface beeswaxAdvertiserResponse {
  id: number;
  active?: boolean;
  account_id: string;
  alternative_id?: string;
  app_bundle?: string;
  category: string;
  domain: string;
  create_date?: Date;
  default_campaign_preset_id?: number;
  default_click_url?: string;
  default_continent: string;
  default_creative_thumbnail_url?: string;
  default_currency: string;
  default_line_item_preset_id?: number;
  default_targeting_preset_id?: number;
  is_comcast_segment_eligible?: boolean;
  last_active?: Date;
  name: string;
  notes?: string;
  skad_network?: SkadNetwork;
  update_date: Date;
}

export interface beeswaxCampaignResponse {
  id: number;
  create_date?: Date;
  update_date: Date;
  last_active?: Date;
  name: string;
  active?: boolean;
  advertiser_id: number;
  bid_modifier_id?: number;
  delivery_modifier_id?: number;
  alternative_id?: string;
  notes?: string;
  currency: string;
  min_bid?: string;
  max_bid?: string;
  continents: string;
  default_line_item_preset_id?: number;
  default_targeting_preset_id?: number;
  start_date?: Date;
  end_date?: Date;
  skad_network?: SkadNetwork;
  revenue?: Revenue;
  spend: string;
  impressions: number;
  budget_type: budgetType;
  spend_budget?: SpendBudget;
  impressions_budget?: ImpressionsBudget;
  vendor_fees?: VendorFee[];
  ghost_bidding?: GhostBidding;
  event_ids?: string[];
  frequency_caps?: FrequencyCaps;
  segment_extension?: SegmentExtension;
  experiment?: Experiment;
  account_id?: string;
  was_activated?: string;
}

export interface beeswaxLineItemResponse {
  id: number;
  account_id: string;
  create_date?: Date;
  update_date: Date;
  last_active?: Date;
  advertiser_id: string;
  campaign_id: number;
  name: string;
  active?: boolean;
  type: 'banner' | 'video' | 'native';
  bid_modifier_id?: number;
  delivery_modifier_id?: number;
  targeting_expression_id?: number;
  start_date?: Date;
  end_date?: Date;
  alternative_id?: string;
  notes?: string;
  currency: string;
  guaranteed?: boolean;
  min_bid?: string;
  max_bid?: string;
  bidding?: Bidding;
  skad_network?: SkadNetwork;
  revenue?: Revenue;
  spend: string;
  impressions: number;
  budget_type: budgetType;
  spend_budget?: SpendBudget;
  impressions_budget?: ImpressionsBudget;
  budget_carry_over_type?:
    | 'None'
    | 'carry_over'
    | 'evenly_distribute'
    | 'prorated_distribute';
  vendor_fees?: VendorFee[];
  active_flights?: Flight[];
  past_flights?: Flight[];
  ghost_bidding?: GhostBidding;
  frequency_caps?: FrequencyCaps;
  segment_extension?: SegmentExtension;
  test_plan_id: number;
  test_group_id?: number;
  user_timezones?: string[];
}

// --------------------------------------------------
// Objects
// --------------------------------------------------

export type budgetType =
  | 'spend'
  | 'spend including vendor fees'
  | 'impressions';

export type idType = 'STANDARD' | 'IP_ADDR' | 'PERSON' | 'HOUSEHOLD';

export interface CreativeAttribute {
  enable_skad_tracking: boolean;
}

export interface Bidding {
  strategy:
    | 'CPM'
    | 'CPC'
    | 'VCR'
    | 'CPM_PACED'
    | 'CPC_PACED'
    | 'VCR_PACED'
    | 'CPA'
    | 'CPA_PACED';
  values: object;
  pacing: 'daily' | 'flight' | 'lifetime' | 'none' | null;
  pacing_behavior?: 'even' | 'ahead';
  multiplier?: string;
  catchup_behavior?: 'immediate' | 'even' | 'smooth';
  custom: boolean;
  bid_shading_control: 'less_aggressive' | 'more_aggressive' | 'normal' | null;
}

export interface SkadNetwork {
  enable_skad_tracking: boolean;
  assignment_level?: 'creative_line_item' | 'line_item';
  target_skad?: boolean;
  skad_mmp?: 'APPSFLYER' | 'SINGULAR' | 'NONE';
}

export interface Revenue {
  type: 'CPM' | 'CPC' | 'CPCV' | 'CPI' | 'CPA';
  amount: string;
}

export interface SpendBudget {
  lifetime: string;
  daily?: string | null;
  include_fees?: string;
}

export interface ImpressionsBudget {
  lifetime: number;
  daily?: number | null;
}

export interface VendorFee {
  id?: number;
  vendor?: string;
  vendor_id?: number;
  name: string;
  cpm_currency?: string | null;
  cpm_amount?: string | null;
  percentage?: string | null;
}

export interface Flight {
  id?: number;
  name?: string;
  start_date: Date;
  end_date: Date | null;
  spend_budget?: string | null;
  impressions_budget?: number | null;
  on_schedule_indicator?: string;
  days_remaining?: string;
  hours_remaining_percentage?: string;
  spend?: string;
  impressions?: string;
  flight_budget_percentage?: string;
  budget_carry_over?: string;
  total_budget?: string;
}

export interface GhostBidding {
  id_type: idType;
  id_vendor?: string | null;
  id_vendor_id?: number | null;
}

export interface FrequencyCaps {
  id_type: idType;
  use_fallback: boolean | null;
  id_vendor?: string | null;
  id_vendor_id?: number | null;
  limits: { duration: number; impressions: number }[];
}

export interface SegmentExtension {
  extension_type:
    | 'person'
    | 'household'
    | 'person_extend_only'
    | 'household_extend_only';
  segment_type: 'all' | '1st_party' | '3rd_party';
  vendors: { id?: number; name?: 'liveramp' | 'tapad' | 'freewheel' }[];
}

export interface Experiment {
  id_type: idType;
  id_vendor?: string | null;
  id_vendor_id?: number | null;
  id_test_plan_id?: number;
  line_items: { id: number; name: string; test_group: number }[];
}

// --------------------------------------------------
// Bid Modifier
// --------------------------------------------------

export type Term = {
  targeting_key: string;
  comparator: string;
  value: string;
  multiplier: number;
};

export type bidModifierRequest = {
  terms: Term[];
  bid_model_id: number | null;
  name: string;
  alternative_id: string;
  account_id: number;
  advertiser_id: number | null;
  notes: string;
};

/**
 * Generates bid modifier request based on deals for beeswax API
 */
export function getBidModifierRequest(
  accountID: number,
  alternativeID: string,
  targetingGroupName: string,
  deals: { id: string; multiplier: number }[],
  notes: string,
): bidModifierRequest {
  const request: bidModifierRequest = {
    terms: [],
    bid_model_id: null,
    name: `${alternativeID}_${targetingGroupName}`,
    alternative_id: alternativeID,
    account_id: accountID,
    advertiser_id: null,
    notes: notes,
  };

  if (deals.length > 0) {
    const dealTerms: Term[] = [];
    deals.forEach((deal) => {
      dealTerms.push({
        targeting_key: 'deal_id',
        comparator: 'equals',
        value: deal.id,
        multiplier: Math.round(deal.multiplier * 100) / 100,
      });
    });
    request.terms = dealTerms;
  }

  return request;
}

// --------------------------------------------------
// Targeting Expression
// --------------------------------------------------

export type GeoTargeting = {
  country: string[];
  city: string[];
  region: string[];
  metro: string[];
  zip: string[];
};

export type Comparator = {
  comparator: string;
  value: string;
};

export type targetingExpressionRequest = {
  modules: {
    app_site?: {
      all: {
        app_bundle_list?: {
          any: Comparator[];
        };
        deal_id?: {
          any: Comparator[];
        };
      };
    };
    geo: {
      all: {
        country?: {
          any: Comparator[];
        };
      };
      any: {
        city?: {
          any: Comparator[];
        };
        region?: {
          any: Comparator[];
        };
        metro?: {
          any: Comparator[];
        };
        zip?: {
          any: Comparator[];
        };
      };
    };
    platform?: {
      all: {
        device_type: {
          any: { comparator: string; value: number }[];
        };
      };
    };
    user?: {
      all: {
        segment?: {
          any: Comparator[];
        };
      };
    };
  };
  active: boolean;
  alternative_id: string;
  name: string;
  guaranteed: boolean;
  account_id: number;
};

/**
 * Generates targeting expression request based on targeting for beeswax API
 */
export function getTargetingExpressionRequest(
  accountID: number,
  alternativeID: string,
  targetingGroupName: string,
  apps: string[],
  deals: string[],
  geo: GeoTargeting,
  segments: string,
): targetingExpressionRequest {
  const request: targetingExpressionRequest = {
    modules: {
      // TODO: remove defaults once device targeting is available in Skybeam
      platform: {
        all: {
          device_type: {
            any: [
              {
                comparator: 'equals',
                value: 6, // Connected Device
              },
              {
                comparator: 'equals',
                value: 3, // Connected TV
              },
              {
                comparator: 'equals',
                value: 8, // Game Console
              },
              {
                comparator: 'equals',
                value: 7, // Set Top Box
              },
            ],
          },
        },
      },
      geo: {
        all: {},
        any: {},
      },
    },
    active: true,
    alternative_id: alternativeID,
    name: targetingGroupName + '_Targeting',
    guaranteed: false,
    account_id: accountID,
  };

  if (apps.length > 0 || deals.length > 0) {
    const appComparators: Comparator[] = [];
    apps.forEach((app) => {
      appComparators.push({ comparator: 'equals', value: app });
    });
    const dealComparators: Comparator[] = [];
    deals.forEach((deal) => {
      dealComparators.push({ comparator: 'equals', value: deal });
    });
    request.modules.app_site = {
      all: {
        app_bundle_list: {
          any: appComparators,
        },
        deal_id: {
          any: dealComparators,
        },
      },
    };
  }

  if (geo.country.length > 0) {
    const countryComparators: Comparator[] = [];
    geo.country.forEach((country) => {
      countryComparators.push({ comparator: 'equals', value: country });
    });
    request.modules.geo.all = {
      country: {
        any: countryComparators,
      },
    };
  }

  if (
    geo.city.length > 0 ||
    geo.region.length > 0 ||
    geo.metro.length > 0 ||
    geo.zip.length > 0
  ) {
    const cityComparators: Comparator[] = [];
    geo.city.forEach((city) => {
      cityComparators.push({ comparator: 'equals', value: city });
    });
    const regionComparators: Comparator[] = [];
    geo.region.forEach((region) => {
      regionComparators.push({ comparator: 'equals', value: region });
    });
    const metroComparators: Comparator[] = [];
    geo.metro.forEach((metro) => {
      metroComparators.push({ comparator: 'equals', value: metro });
    });
    const zipComparators: Comparator[] = [];
    geo.zip.forEach((zip) => {
      zipComparators.push({ comparator: 'equals', value: zip });
    });
    request.modules.geo.any = {
      city: {
        any: cityComparators,
      },
      region: {
        any: regionComparators,
      },
      metro: {
        any: metroComparators,
      },
      zip: {
        any: zipComparators,
      },
    };
  }

  if (segments.length > 0) {
    request.modules.user = {
      all: {
        segment: {
          any: [{ comparator: 'boolean_expression', value: segments }],
        },
      },
    };
  }

  return request;
}

// --------------------------------------------------
// IAB Categories
// --------------------------------------------------

export const iabCategoryMap = new Map<string, string>([
  ['Arts & Entertainment', 'IAB1'],
  ['Automotive', 'IAB2'],
  ['Business', 'IAB3'],
  ['Careers', 'IAB4'],
  ['Education', 'IAB5'],
  ['Family & Parenting', 'IAB6'],
  ['Health & Fitness', 'IAB7'],
  ['Food & Drink', 'IAB8'],
  ['Hobbies & Interests', 'IAB9'],
  ['Home & Garden', 'IAB10'],
  ['Law, Government & Politics', 'IAB11'],
  ['News, Weather & Information', 'IAB12'],
  ['Personal Finance', 'IAB13'],
  ['Society', 'IAB14'],
  ['Science', 'IAB15'],
  ['Pets', 'IAB16'],
  ['Sports', 'IAB17'],
  ['Style & Fashion', 'IAB18'],
  ['Technology & Computing', 'IAB19'],
  ['Travel', 'IAB20'],
  ['Real Estate', 'IAB21'],
  ['Shopping', 'IAB22'],
  ['Religion & Spirituality', 'IAB23'],
  ['Uncategorized', 'IAB24'],
  ['Other', 'IAB24'],
]);
