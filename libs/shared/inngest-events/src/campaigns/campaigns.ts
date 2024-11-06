import { budgetTypeEnum, frequencyPeriodEnum } from '@limelight/shared-drizzle';

type CampaignUpserted = {
  data: {
    id: string;
    name: string;
    budget: number;
    budget_type: (typeof budgetTypeEnum.enumValues)[number];
    advertiser_id: string;
    start_date: Date;
    end_date: Date;
    alt_id: number;
    user_id: string;
    frequency: number;
    frequency_period: (typeof frequencyPeriodEnum.enumValues)[number];
  };
};

type CampaignActivated = {
  data: {
    id: string;
    name: string;
    advertiser_id: string;
    alt_id: number;
    user_id: string;
  };
};

type CampaignDeleted = {
  data: {
    id: string;
    name: string;
    advertiser_id: string;
    external_id: string;
    targeting_group_ids: string[];
    user_id: string;
  };
};

type CampaignId = {
  data: {
    id: string;
  };
};

export type CampaignEvents = {
  'campaigns/campaign.created': CampaignUpserted;
  'campaigns/campaign.updated': CampaignUpserted;
  'campaigns/campaign.activated': CampaignActivated;
  'campaigns/campaign.deleted': CampaignDeleted;
  'campaigns/create.slack.blocks': CampaignId;
  'campaigns/translate.campaign': CampaignId;
  'campaigns/upload.s3': CampaignId;
  'campaigns/write.retargeting.to.slack': CampaignId;
};
