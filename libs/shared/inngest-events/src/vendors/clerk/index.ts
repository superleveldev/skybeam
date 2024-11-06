import {
  type EmailWebhookEvent,
  type OrganizationInvitationWebhookEvent,
  type OrganizationMembershipWebhookEvent,
  type OrganizationWebhookEvent,
  type SessionWebhookEvent,
  type UserWebhookEvent,
  type SMSWebhookEvent,
} from '@clerk/nextjs/server';

// The SDK doesn't have this
type OrganizationDomainWebhookEvent = {
  data: {
    affiliation_email_address: string; //'example@example.org';
    created_at: number; //1654014189392;
    enrollment_mode: string; //'automatic_invitation';
    id: string; //'orgdmn_29w9IfBrPmcpi0IeBVaKtA7R94W';
    name: string; //'example.org';
    object: string; //'organization_domain';
    organization_id: string; //'org_29w9IfBrPmcpi0IeBVaKtA7R94W';
    total_pending_invitations: number; //3;
    total_pending_suggestions: number; //10;
    updated_at: number; //1654014189392;
    verification: {
      attempts: number; //1;
      expire_at: number; //1654014189392;
      status: string; //'verified';
      strategy: string; //'from_affiliation_email_code';
    };
  };
  object: string; //'event';
  type: string; //'organizationDomain.created';
};

// The SDK doesn't have this
type PermissionWebhookEvent = {
  data: {
    created_at: number; //1701115768576;
    description: string; //'Custom permission to manage organization billing';
    id: string; //'perm_2Ym16qDMKg37umUxkqDlizY7dfi';
    key: string; //'org:billing:manage';
    name: string; //'manage billing permission';
    object: string; //'permission';
    type: string; //'user';
    updated_at: number; //1701115768576;
  };
  object: string; //'event';
  type: string; //'permission.created';
};

// The SDK doesn't have this
type RoleWebhookEvent = {
  data: {
    created_at: number; //1701116920137;
    description: string; //'My custom role';
    id: string; //'role_2Ym4Iu9JcfMpa4wsTmsRgnY83MX';
    is_creator_eligible: boolean; //false;
    key: string; //'org:my_custom_role';
    name: string; //'custom role';
    object: string; //'role';
    permissions: PermissionWebhookEvent['data'][];
    updated_at: number; //1654013202977;
  };
  object: string; //'event';
  type: string; //'role.created';
};

export type ClerkEvents = {
  'clerk/email.created': EmailWebhookEvent;
  'clerk/organization.created': Extract<
    OrganizationWebhookEvent,
    { type: 'organization.created' | 'organization.updated' }
  >;
  'clerk/organization.updated': Extract<
    OrganizationWebhookEvent,
    { type: 'organization.created' | 'organization.updated' }
  >;
  'clerk/organization.deleted': Extract<
    OrganizationWebhookEvent,
    { type: 'organization.deleted' }
  >;
  'clerk/organizationDomain.created': OrganizationDomainWebhookEvent;
  'clerk/organizationDomain.updated': OrganizationDomainWebhookEvent;
  'clerk/organizationDomain.deleted': {
    data: {
      deleted: boolean; //true;
      id: string; //'orgdmn_29wBIniWYy0slasTNQlmHD9HeN1';
      object: string; //'organization_domain';
    };
    object: string; //'event';
    type: string; //'organizationDomain.deleted';
  };
  'clerk/organizationInvitation.accepted': OrganizationInvitationWebhookEvent;
  'clerk/organizationInvitation.created': OrganizationInvitationWebhookEvent;
  'clerk/organizationInvitation.revoked': OrganizationInvitationWebhookEvent;
  'clerk/organizationMembership.created': OrganizationMembershipWebhookEvent;
  'clerk/organizationMembership.deleted': OrganizationMembershipWebhookEvent;
  'clerk/organizationMembership.updated': OrganizationMembershipWebhookEvent;
  'clerk/session.created': SessionWebhookEvent;
  'clerk/session.ended': SessionWebhookEvent;
  'clerk/session.removed': SessionWebhookEvent;
  'clerk/session.revoked': SessionWebhookEvent;
  'clerk/sms.created': SMSWebhookEvent;
  'clerk/user.created': Extract<
    UserWebhookEvent,
    { type: 'user.created' | 'user.updated' }
  >;
  'clerk/user.updated': Extract<
    UserWebhookEvent,
    { type: 'user.created' | 'user.updated' }
  >;
  'clerk/user.deleted': Extract<UserWebhookEvent, { type: 'user.deleted' }>;
  'clerk/role.created': RoleWebhookEvent;
  'clerk/role.updated': RoleWebhookEvent;
  'clerk/role.deleted': {
    data: {
      deleted: boolean; //true;
      id: string; //'role_2Ym4Iu9JcfMpa4wsTmsRgnY83MX';
      object: string; //'role';
    };
    object: string; //'event';
    type: string; //'role.deleted';
  };
  'clerk/permission.created': PermissionWebhookEvent;
  'clerk/permission.updated': PermissionWebhookEvent;
  'clerk/permission.deleted': {
    data: {
      deleted: boolean; //true;
      id: string; //'perm_2Ym16qDMKg37umUxkqDlizY7dfi';
      object: string; //'permission';
    };
    object: string; //'event';
    type: string; //'permission.deleted';
  };
};
