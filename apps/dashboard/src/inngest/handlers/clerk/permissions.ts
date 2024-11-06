import { inngest } from '../../client';
import { db } from '../../../server/db';
import { permissions } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapPermissionEventToDb = (
  payload: ClerkEvents[
    | 'clerk/permission.created'
    | 'clerk/permission.updated']['data'],
) => {
  return {
    description: payload.description,
    key: payload.key,
    name: payload.name,
    type: payload.type,
    createdAt: new Date(payload.created_at),
    updatedAt: new Date(payload.updated_at),
  };
};

export const clerkPermissionDeleted = inngest.createFunction(
  { id: 'clerk-permission-deleted' },
  { event: 'clerk/permission.deleted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(permissions)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(permissions.id, event.data.id!)); // docs say id is passed, but typing in SDK has it as optional
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no permission found to update, ignoring');
      }
    });
  },
);

export const clerkPermissionUpdated = inngest.createFunction(
  { id: 'clerk-permission-updated' },
  { event: 'clerk/permission.updated' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(permissions)
          .set(mapPermissionEventToDb(event.data))
          .where(eq(permissions.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no permission found to update, ignoring');
      }
    });
  },
);

export const clerkPermissionCreated = inngest.createFunction(
  { id: 'clerk-permission-created' },
  { event: 'clerk/permission.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(permissions).values({
        id: event.data.id,
        ...mapPermissionEventToDb(event.data),
      });
    });
  },
);
