import { inngest } from '../../client';
import { db } from '../../../server/db';
import { users } from '@limelight/shared-drizzle';
import { eq } from 'drizzle-orm';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

const mapUserEventToDb = (
  payload: ClerkEvents['clerk/user.created' | 'clerk/user.updated']['data'],
): Omit<typeof users.$inferSelect, 'deletedAt' | 'vendorIdentityMap'> => {
  return {
    id: payload.id,
    backupCodeEnabled: payload.backup_code_enabled,
    banned: payload.banned,
    createOrganizationEnabled: payload.create_organization_enabled,
    deleteSelfEnabled: (payload as any) /*missing from sdk*/
      .delete_self_enabled,
    emailAddresses: payload.email_addresses,
    externalAccounts: payload.external_accounts,
    externalId: payload.external_id,
    firstName: payload.first_name,
    hasImage: payload.has_image,
    imageUrl: payload.image_url,
    lastName: payload.last_name,
    locked: (payload as any) /*missing from sdk*/.locked,
    lockoutExpiresInSeconds: (payload as any) /*missing from sdk*/
      .lockout_expires_in_seconds,
    passkeys: (payload as any) /*missing from sdk*/.passkeys,
    passwordEnabled: payload.password_enabled,
    phoneNumbers: payload.phone_numbers,
    primaryEmailAddressId: payload.primary_email_address_id,
    primaryPhoneNumberId: payload.primary_phone_number_id,
    primaryWeb3WalletId: payload.primary_web3_wallet_id,
    privateMetadata: payload.private_metadata,
    profileImageUrl: payload.image_url,
    publicMetadata: payload.public_metadata,
    samlAccounts: (payload as any) /*missing from sdk*/.saml_accounts,
    totpEnabled: payload.totp_enabled,
    twoFactorEnabled: payload.two_factor_enabled,
    unsafeMetadata: payload.unsafe_metadata,
    username: payload.username,
    verificationAttemptsRemaining: (payload as any) /*missing from sdk*/
      .verification_attempts_remaining,
    web3Wallets: payload.web3_wallets,
    lastActiveAt: (payload as any) /*missing from sdk*/.last_active_at
      ? new Date((payload as any) /*missing from sdk*/.last_active_at)
      : null,
    lastSignInAt: payload.last_sign_in_at
      ? new Date(payload.last_sign_in_at)
      : null,
    createdAt: new Date(payload.created_at),
    updatedAt: new Date(payload.updated_at),
  };
};

export const clerkUserCreated = inngest.createFunction(
  { id: 'clerk-user-created' },
  { event: 'clerk/user.created' },
  async ({ event, step }) => {
    await step.run('save to PS', async () => {
      const payload = mapUserEventToDb(event.data);

      await db.insert(users).values(payload).onConflictDoUpdate({
        target: users.id,
        set: payload,
      });
    });
  },
);

export const clerkUserUpdated = inngest.createFunction(
  { id: 'clerk-user-updated' },
  { event: 'clerk/user.updated' },
  async ({ event, step }) => {
    await step.run('update in PS', () => {
      const payload = mapUserEventToDb(event.data);

      return db.insert(users).values(payload).onConflictDoUpdate({
        target: users.id,
        set: payload,
      });

      /*try {
        // .where(eq(users.id, event.data.id));
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no user found to update, ignoring');
      }*/
    });
  },
);

export const clerkUserDeleted = inngest.createFunction(
  { id: 'clerk-user-deleted' },
  { event: 'clerk/user.deleted' },
  async ({ event, step }) => {
    await step.run('update in PS', async () => {
      try {
        await db
          .update(users)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(users.id, event.data.id!)); // docs say id is passed, but typing in SDK has it as optional
      } catch (e) {
        // we don't care if it fails, so don't throw on update failure
        console.log('no user found to update, ignoring 2');
      }
    });
  },
);
