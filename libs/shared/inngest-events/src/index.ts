import { AdvertisersEvents } from './advertisers';
import { DemoEvents } from './demo';
import { CampaignsEvents } from './campaigns';
import { CreativesEvents } from './creatives';
import { TargetingGroupsEvents } from './targeting-groups';
import { SlackEvents } from './slack';
import { VendorsEvents } from './vendors';
import { PostHogEvents } from './posthog';

export type InngestEvents = DemoEvents &
  AdvertisersEvents &
  CampaignsEvents &
  CreativesEvents &
  TargetingGroupsEvents &
  VendorsEvents &
  SlackEvents &
  PostHogEvents;
