import { inngest } from '../../client';
import { db } from '../../../server/db';
import { organizationDomains } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapOrganizationDomainEventToDb = (
  payload: ClerkEvents[
    | 'clerk/organizationDomain.created'
    | 'clerk/organizationDomain.updated']['data'],
) => {
  return {
    affiliationEmailAddress: payload.affiliation_email_address, //'example@example.org',
    enrollmentMode: payload.enrollment_mode,
    name: payload.name,
    organizationId: payload.organization_id,
    totalPendingInvitations: payload.total_pending_invitations,
    totalPendingSuggestions: payload.total_pending_suggestions,
    updatedAt: new Date(payload.updated_at),
    verificationAttempts: payload.verification.attempts,
    verificationExpireAt: new Date(payload.verification.expire_at),
    verificationStatus: payload.verification.status,
    verificationStrategy: payload.verification.strategy,
  };
};

export const clerkOrganizationDomainDeleted = inngest.createFunction(
  { id: 'clerk-organization-domain-deleted' },
  { event: 'clerk/organizationDomain.deleted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizationDomains)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(organizationDomains.id, event.data.id!)); // docs say id is passed, but typing in SDK has it as optional
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization domain found to update, ignoring');
      }
    });
  },
);

export const clerkOrganizationDomainUpdated = inngest.createFunction(
  { id: 'clerk-organization-domain-updated' },
  { event: 'clerk/organizationDomain.updated' },
  async ({ event, step }) => {
    try {
      await db
        .update(organizationDomains)
        .set(mapOrganizationDomainEventToDb(event.data))
        .where(eq(organizationDomains.id, event.data.id));
    } catch (e) {
      // we don't care if it fails, so don't throw on update failure
      console.log('no organization domain found to update, ignoring');
    }
  },
);

export const clerkOrganizationDomainCreated = inngest.createFunction(
  { id: 'clerk-organization-domain-created' },
  { event: 'clerk/organizationDomain.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(organizationDomains).values({
        id: event.data.id,
        ...mapOrganizationDomainEventToDb(event.data),
      });
    });
  },
);
