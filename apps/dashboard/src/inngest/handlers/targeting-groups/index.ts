import {
  targetingGroupCreated,
  targetingGroupUpdated,
  writeTargetingGroupToSlack,
} from './targeting-groups';

export const targetingGroupsHandlers = [
  targetingGroupCreated,
  targetingGroupUpdated,
  writeTargetingGroupToSlack,
];
