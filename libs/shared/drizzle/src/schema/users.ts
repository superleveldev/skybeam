import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'user_29w83sxmDNGwOuEthce5gg56FcC',
  backupCodeEnabled: boolean('backup_code_enabled'), //false,
  banned: boolean('banned'), // false,
  createOrganizationEnabled: boolean('create_organization_enabled'), // true,
  deleteSelfEnabled: boolean('delete_self_enabled'), // true,
  emailAddresses: jsonb('email_addresses').$type<
    {
      [key: string]: any;
    }[]
  >(),
  externalAccounts: jsonb('external_accounts').$type<
    {
      [key: string]: any;
    }[]
  >(),
  externalId: varchar('external_id', { length: 256 }), // null,
  firstName: varchar('first_name', { length: 256 }), //  "JR",
  hasImage: boolean('has_image'), // true,
  imageUrl: text('image_url'), // "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJjaERPSDNoMU53MHE5TFFKZnN5emV4VElhdSJ9",
  lastName: varchar('last_name', { length: 256 }), //  " Razmus",
  locked: boolean('locked'), // false,
  lockoutExpiresInSeconds: bigint('lockout_expires_in_seconds', {
    mode: 'number',
  }), // null,
  passkeys: jsonb('passkeys').$type<
    {
      [key: string]: any;
    }[]
  >(),
  passwordEnabled: boolean('password_enabled'), // false,
  phoneNumbers: jsonb('phone_numbers').$type<
    {
      [key: string]: any;
    }[]
  >(),
  primaryEmailAddressId: varchar('primary_email_address_id', { length: 256 }), //  "idn_2b3VJzHLYlvSa66kZ1vNABTKl3z",
  primaryPhoneNumberId: varchar('primary_phone_number_id', { length: 256 }), //  null,
  primaryWeb3WalletId: varchar('primary_web3_wallet_id', { length: 256 }), //  null,
  privateMetadata: jsonb('private_metadata').$type<{
    [key: string]: any;
  }>(),
  profileImageUrl: text('profile_image_url'), //  "https://images.clerk.dev/uploaded/img_2chDOH3h1Nw0q9LQJfsyzexTIau",
  publicMetadata: jsonb('public_metadata').$type<{
    [key: string]: any;
  }>(),
  samlAccounts: jsonb('saml_accounts').$type<
    {
      [key: string]: any;
    }[]
  >(),
  totpEnabled: boolean('totp_enabled'), // false,
  twoFactorEnabled: boolean('two_factor_enabled'), // false,
  unsafeMetadata: jsonb('unsafe_metadata').$type<{
    [key: string]: any;
  }>(),
  username: varchar('username', { length: 256 }), //  null,
  verificationAttemptsRemaining: integer('verification_attempts_remaining'), // 100,
  web3Wallets: jsonb('web3_wallets').$type<
    {
      [key: string]: any;
    }[]
  >(),
  vendorIdentityMap: jsonb('vendor_identity_map').$type<{
    [key: string]: (string | number)[];
  }>(),
  lastActiveAt: timestamp('last_active_at'), //  1713227620699,
  lastSignInAt: timestamp('last_sign_in_at'), //  1712449448168,
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
});
