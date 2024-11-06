import { BeeswaxEvents } from './beeswax';
import { StripeEvents } from './stripe';
import { ClerkEvents } from './clerk';

export type VendorsEvents = BeeswaxEvents & StripeEvents & ClerkEvents;
