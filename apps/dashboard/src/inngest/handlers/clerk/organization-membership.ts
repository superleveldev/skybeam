import { inngest } from '../../client';
import { db } from '../../../server/db';
import { organizationMemberships } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapOrganizationMembershipEventToDb = (
  payload: ClerkEvents[
    | 'clerk/organizationMembership.created'
    | 'clerk/organizationMembership.updated'
    | 'clerk/organizationMembership.deleted']['data'],
) => {
  return {
    organizationCreatedBy: payload.organization.created_by,
    organizationId: payload.organization.id,
    organizationImageUrl: payload.organization.image_url,
    organizationLogoUrl: payload.organization.image_url,
    organizationName: payload.organization.name,
    organizationSlug: payload.organization.slug,
    organizationCreatedAt: new Date(payload.organization.created_at),
    organizationUpdatedAt: new Date(payload.organization.updated_at),
    publicUserDataFirstName: payload.public_user_data.first_name,
    publicUserDataIdentifier: payload.public_user_data.identifier,
    publicUserDataImageUrl: payload.public_user_data.image_url,
    publicUserDataLastName: payload.public_user_data.last_name,
    publicUserDataProfileImageUrl: payload.public_user_data.image_url,
    publicUserDataUserId: payload.public_user_data.user_id,
    role: payload.role,
    updatedAt: new Date(payload.updated_at),
  };
};

export const clerkOrganizationMembershipUpdated = inngest.createFunction(
  { id: 'clerk-organization-membership-updated' },
  { event: 'clerk/organizationMembership.updated' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizationMemberships)
          .set(mapOrganizationMembershipEventToDb(event.data))
          .where(eq(organizationMemberships.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization membership found to update, ignoring');
      }
    });

    await step.run('maybe update active subscription', () => {
      // TODO: maybe update subscription of something
    });
  },
);

export const clerkOrganizationMembershipDeleted = inngest.createFunction(
  { id: 'clerk-organization-membership-deleted' },
  { event: 'clerk/organizationMembership.deleted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizationMemberships)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(organizationMemberships.id, event.data.id!)); // docs say id is passed, but typing in SDK has it as optional
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization membership found to update, ignoring');
      }
    });

    await step.run('maybe update active subscription', () => {
      // TODO: maybe update subscription of something
    });
  },
);

export const clerkOrganizationMembershipCreated = inngest.createFunction(
  { id: 'clerk-organization-membership-created' },
  { event: 'clerk/organizationMembership.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(organizationMemberships).values({
        id: event.data.id,
        ...mapOrganizationMembershipEventToDb(event.data),
      });
    });

    await step.run('maybe update active subscription', () => {
      // TODO: maybe update subscription of something
    });
  },
);
