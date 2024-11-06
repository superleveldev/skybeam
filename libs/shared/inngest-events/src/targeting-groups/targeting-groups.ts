import { GeoTargeting } from '@limelight/shared-utils/beeswax/beeswax';

type TargetingGroupUpserted = {
  data: {
    id: string;
    campaign_id: string;
    budget: number;
    name: string;
    alt_id: number;
    user_id: string;
    geo_targeting: GeoTargeting;
    inventories: string[];
    age: string[];
    categories: string[];
    gender: string[];
  };
};

type TargetingGroupDeleted = {
  data: {
    id: string;
    external_id: string;
    user_id: string;
  };
};

type TargetingGroupToSlackType = {
  data: {
    id: string;
    userId?: string;
  };
};

export type TargetingGroupEvents = {
  'targetingGroups/targetingGroup.created': TargetingGroupUpserted;
  'targetingGroups/targetingGroup.updated': TargetingGroupUpserted;
  'targetingGroups/targetingGroup.deleted': TargetingGroupDeleted;
  'targetingGroups/write.to.slack': TargetingGroupToSlackType;
};
