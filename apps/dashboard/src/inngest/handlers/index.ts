import { advertisersHandlers } from './advertisers';
import { demoHandlers } from './demo';
import { campaignsHandlers } from './campaigns';
import { clerkHandlers } from './clerk';
import { stripeHandlers } from './stripe';
import { creativeHandlers } from './creatives';
import { slackHandlers } from './slack';
import { targetingGroupsHandlers } from './targeting-groups';
import { posthogHandlers } from './posthog';

export const inngestFunctions = [
  ...advertisersHandlers,
  ...demoHandlers,
  ...campaignsHandlers,
  ...clerkHandlers,
  ...stripeHandlers,
  ...creativeHandlers,
  ...targetingGroupsHandlers,
  ...slackHandlers,
  ...posthogHandlers,
];
