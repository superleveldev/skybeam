import { api } from '../../../trpc/server';
import { objectiveEnum } from '@limelight/shared-drizzle';
import {
  SelectCampaignSchema,
  Campaign as _Campaign,
  Advertiser,
} from '@limelight/shared-drizzle';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import { ReactNode } from 'react';

export type Objective = (typeof objectiveEnum.enumValues)[number];

export type Campaign = _Campaign & {
  advertiser?: Omit<Advertiser, 'clerkOrganizationId'>;
};

export type CampaignQueryParams = Parameters<
  typeof api.campaigns.getCampaigns.query
>[0];
export type CampaignFields = keyof typeof SelectCampaignSchema.shape;
export type CampaignSort = `${CampaignFields}` | `-${CampaignFields}`;
export interface CampaignsParams extends SearchParams {
  sort: CampaignSort;
  status: Campaign['status'];
}
export type CampaignsProps = {
  searchParams: CampaignsParams;
};
export interface InfoCardProps {
  content: string;
  cta: string;
  icon: ReactNode;
  title: string;
  url: string;
  isComingSoon?: boolean;
}

export type CampaignStatus = 'draft' | 'published' | 'finished';
