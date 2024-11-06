import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { organizations } from './organizations';
import { users } from './users';

// --------------------------------------------------
// Tables
// --------------------------------------------------

export const organizationMemberships = pgTable('organization_memberships', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'orgmem_29w9IptNja3mP8GDXpquBwN2qR9',
  organizationCreatedBy: varchar('organization_created_by', { length: 256 }), //'user_1vq84bqWzw7qmFgqSwN4CH1Wp0n',
  organizationId: varchar('organization_id', { length: 256 }).references(
    () => organizations.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ), //'org_29w9IfBrPmcpi0IeBVaKtA7R94W',
  organizationImageUrl: text('organization_image_url'), //'https://img.clerk.com/xxxxxx',
  organizationLogoUrl: text('organization_logo_url'), //'https://example.com/example.png',
  organizationName: varchar('organization_name', { length: 256 }), //'Acme Inc',
  // public_metadata: {},
  organizationSlug: varchar('organization_slug', { length: 256 }), //'acme-inc',
  organizationCreatedAt: timestamp('organization_created_at'), //1654013202977,
  organizationUpdatedAt: timestamp('organization_updated_at'), //1654013202977,
  publicUserDataFirstName: varchar('public_user_data_first_name', {
    length: 256,
  }), //'Example',
  publicUserDataIdentifier: varchar('public_user_data_identifier', {
    length: 256,
  }), //'example@example.org',
  publicUserDataImageUrl: text('public_user_data_image_url'), //'https://img.clerk.com/xxxxxx',
  publicUserDataLastName: varchar('public_user_data_last_name', {
    length: 256,
  }), //'Example',
  publicUserDataProfileImageUrl: text('public_user_data_profile_image_url'), //'https://www.gravatar.com/avatar?d=mp',
  publicUserDataUserId: varchar('public_user_data_user_id', {
    length: 256,
  }).references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }), //'user_29w83sxmDNGwOuEthce5gg56FcC',
  role: varchar('role', { length: 256 }), //'admin',
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
});

export const organizationsMembershipRelations = relations(
  organizationMemberships,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMemberships.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [organizationMemberships.publicUserDataUserId],
      references: [users.id],
    }),
  }),
);
