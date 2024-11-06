import { inngest } from '../../client';
import { db } from '../../../server/db';
import { organizations } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapOrganizationEventToDb = (
  payload: ClerkEvents[
    | 'clerk/organization.created'
    | 'clerk/organization.updated']['data'],
) => {
  return {
    createdBy: payload.created_by,
    imageUrl: payload.image_url,
    logoUrl: payload.image_url,
    name: payload.name,
    slug: payload.slug,
  };
};

export const clerkOrganizationUpdated = inngest.createFunction(
  { id: 'clerk-organization-updated' },
  { event: 'clerk/organization.updated' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizations)
          .set(mapOrganizationEventToDb(event.data))
          .where(eq(organizations.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization found to update, ignoring');
      }
    });
  },
);

export const clerkOrganizationDeleted = inngest.createFunction(
  { id: 'clerk-organization-deleted' },
  { event: 'clerk/organization.deleted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(organizations)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(organizations.id, event.data.id!)); // docs say id is passed, but typing in SDK has it as optional
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no organization found to update, ignoring');
      }
    });

    await step.run('maybe delete active subscription', () => {
      // TODO: maybe cancel subscription of something
    });
  },
);

export const clerkOrganizationCreated = inngest.createFunction(
  { id: 'clerk-organization-created' },
  { event: 'clerk/organization.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(organizations).values({
        id: event.data.id,
        ...mapOrganizationEventToDb(event.data),
      });
    });
  },
);
