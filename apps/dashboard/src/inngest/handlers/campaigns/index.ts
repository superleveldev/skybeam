import {
  campaignCreated,
  campaignUpdated,
  campaignActivated,
  campaignDeleted,
  createCampaignSlackBlocks,
  translateCampaignToJson,
  writeCampaignToS3,
  writeRetargetingCampaignToSlack,
} from './campaigns';

export const campaignsHandlers = [
  campaignCreated,
  campaignUpdated,
  campaignActivated,
  campaignDeleted,
  createCampaignSlackBlocks,
  translateCampaignToJson,
  writeCampaignToS3,
  writeRetargetingCampaignToSlack,
];
