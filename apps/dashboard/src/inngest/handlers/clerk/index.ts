import {
  clerkSessionCreated,
  clerkSessionEnded,
  clerkSessionRemoved,
  clerkSessionRevoked,
} from './sessions';
import { clerkSmsCreated } from './sms';
import { clerkEmailMessageCreated } from './email-messages';
import {
  clerkOrganizationCreated,
  clerkOrganizationDeleted,
  clerkOrganizationUpdated,
} from './organizations';
import {
  clerkOrganizationDomainCreated,
  clerkOrganizationDomainDeleted,
  clerkOrganizationDomainUpdated,
} from './organization-domains';
import {
  clerkOrganizationInvitationAccepted,
  clerkOrganizationInvitationCreated,
  clerkOrganizationInvitationRevoked,
} from './organization-invitations';
import {
  clerkOrganizationMembershipCreated,
  clerkOrganizationMembershipDeleted,
  clerkOrganizationMembershipUpdated,
} from './organization-membership';
import { clerkUserCreated, clerkUserDeleted, clerkUserUpdated } from './users';
import {
  clerkPermissionCreated,
  clerkPermissionDeleted,
  clerkPermissionUpdated,
} from './permissions';
import { clerkRoleCreated, clerkRoleDeleted, clerkRoleUpdated } from './roles';

export const clerkHandlers = [
  clerkEmailMessageCreated,
  clerkOrganizationCreated,
  clerkOrganizationDeleted,
  clerkOrganizationUpdated,
  clerkOrganizationDomainCreated,
  clerkOrganizationDomainUpdated,
  clerkOrganizationDomainDeleted,
  clerkOrganizationInvitationCreated,
  clerkOrganizationInvitationAccepted,
  clerkOrganizationInvitationRevoked,
  clerkOrganizationMembershipCreated,
  clerkOrganizationMembershipDeleted,
  clerkOrganizationMembershipUpdated,
  clerkPermissionCreated,
  clerkPermissionUpdated,
  clerkPermissionDeleted,
  clerkRoleCreated,
  clerkRoleUpdated,
  clerkRoleDeleted,
  clerkSessionCreated,
  clerkSessionEnded,
  clerkSessionRemoved,
  clerkSessionRevoked,
  clerkSmsCreated,
  clerkUserCreated,
  clerkUserUpdated,
  clerkUserDeleted,
];
