type AdvertiserUpserted = {
  data: {
    id: string;
    name: string;
    website: string;
    industry: string;
    alt_id: number;
    user_id: string;
  };
};

type AdvertiserDeleted = {
  data: {
    id: string;
    name: string;
    website: string;
    industry: string;
    external_id: string;
    user_id: string;
  };
};

export type AdvertiserEvents = {
  'advertisers/advertiser.created': AdvertiserUpserted;
  'advertisers/advertiser.updated': AdvertiserUpserted;
  'advertisers/advertiser.deleted': AdvertiserDeleted;
};
