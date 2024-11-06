import { inngest } from '../../client';
import { db } from '../../../server/db';
import { roles } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapRoleEventToDb = (
  payload: ClerkEvents['clerk/role.created' | 'clerk/role.updated']['data'],
) => {
  return {
    description: payload.description,
    isCreatorEligible: payload.is_creator_eligible,
    key: payload.key,
    name: payload.name,
    createdAt: new Date(payload.created_at),
    updatedAt: new Date(payload.updated_at),
  };
};

export const clerkRoleDeleted = inngest.createFunction(
  { id: 'clerk-role-deleted' },
  { event: 'clerk/role.deleted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(roles)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(roles.id, event.data.id!)); // docs say id is passed, but typing in SDK has it as optional
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no role found to update, ignoring');
      }
    });
  },
);

export const clerkRoleUpdated = inngest.createFunction(
  { id: 'clerk-role-updated' },
  { event: 'clerk/role.updated' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(roles)
          .set(mapRoleEventToDb(event.data))
          .where(eq(roles.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no role found to update, ignoring');
      }
    });
  },
);

export const clerkRoleCreated = inngest.createFunction(
  { id: 'clerk-role-created' },
  { event: 'clerk/role.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(roles).values({
        id: event.data.id,
        ...mapRoleEventToDb(event.data),
      });
    });
  },
);
