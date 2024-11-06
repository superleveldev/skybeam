import { inngest } from '../../client';
import { db } from '../../../server/db';
import { organizationInvitations } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapOrganizationInvitationEventToDb = (
  payload: ClerkEvents[
    | 'clerk/organizationInvitation.accepted'
    | 'clerk/organizationInvitation.created'
    | 'clerk/organizationInvitation.revoked']['data'],
) => {
  return {
    emailAddress: payload.email_address,
    organizationId: payload.organization_id,
    role: payload.role,
    status: payload.status,
    updatedAt: new Date(payload.updated_at),
  };
};

export const clerkOrganizationInvitationRevoked = inngest.createFunction(
  { id: 'clerk-organization-invitation-revoked' },
  { event: 'clerk/organizationInvitation.revoked' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizationInvitations)
          .set(mapOrganizationInvitationEventToDb(event.data))
          .where(eq(organizationInvitations.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization invitation found to update, ignoring');
      }
    });
  },
);

export const clerkOrganizationInvitationCreated = inngest.createFunction(
  { id: 'clerk-organization-invitation-created' },
  { event: 'clerk/organizationInvitation.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(organizationInvitations).values({
        id: event.data.id,
        ...mapOrganizationInvitationEventToDb(event.data),
      });
    });
  },
);

export const clerkOrganizationInvitationAccepted = inngest.createFunction(
  { id: 'clerk-organization-invitation-accepted' },
  { event: 'clerk/organizationInvitation.accepted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizationInvitations)
          .set(mapOrganizationInvitationEventToDb(event.data))
          .where(eq(organizationInvitations.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization invitation found to update, ignoring');
      }
    });
  },
);
