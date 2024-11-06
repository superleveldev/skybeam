import { inngest } from '../../client';
import { db } from '../../../server/db';
import { sessions } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapSessionEventToDb = (
  payload: ClerkEvents[
    | 'clerk/session.created'
    | 'clerk/session.ended'
    | 'clerk/session.removed'
    | 'clerk/session.revoked']['data'],
) => {
  return {
    abandonAt: new Date(payload.abandon_at),
    clientId: payload.client_id,
    createdAt: new Date(payload.created_at),
    expireAt: new Date(payload.expire_at),
    lastActiveAt: new Date(payload.last_active_at),
    status: payload.status,
    updatedAt: new Date(payload.updated_at),
    userId: payload.user_id,
  };
};

export const clerkSessionRevoked = inngest.createFunction(
  { id: 'clerk-session-revoked' },
  { event: 'clerk/session.revoked' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(sessions)
          .set(mapSessionEventToDb(event.data))
          .where(eq(sessions.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no session found to update, ignoring');
      }
    });
  },
);

export const clerkSessionRemoved = inngest.createFunction(
  { id: 'clerk-session-removed' },
  { event: 'clerk/session.removed' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(sessions)
          .set(mapSessionEventToDb(event.data))
          .where(eq(sessions.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no session found to update, ignoring');
      }
    });
  },
);

export const clerkSessionEnded = inngest.createFunction(
  { id: 'clerk-session-ended' },
  { event: 'clerk/session.ended' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(sessions)
          .set(mapSessionEventToDb(event.data))
          .where(eq(sessions.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no session found to update, ignoring');
      }
    });
  },
);

export const clerkSessionCreated = inngest.createFunction(
  { id: 'clerk-session-created' },
  { event: 'clerk/session.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(sessions).values({
        id: event.data.id,
        ...mapSessionEventToDb(event.data),
      });
    });
  },
);
