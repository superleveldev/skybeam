type BeesewaxGenerateCampaignUUID = {
  data: {
    campaignId: string;
  };
};

export type BeeswaxEvents = {
  'vendors/beeswax.generateCampaignUUID': BeesewaxGenerateCampaignUUID;
};
