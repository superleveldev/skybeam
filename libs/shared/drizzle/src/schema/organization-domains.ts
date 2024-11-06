import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { organizations } from './organizations';

export const organizationDomains = pgTable('organization_domains', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'orgdmn_29w9IfBrPmcpi0IeBVaKtA7R94W'
  affiliationEmailAddress: varchar('affiliation_email_address', {
    length: 256,
  }), //'example@example.org',
  enrollmentMode: varchar('enrollment_mode', { length: 256 }), //'automatic_invitation',
  name: varchar('name', { length: 256 }), //'example.org',
  organizationId: varchar('organization_id', { length: 256 }).references(
    () => organizations.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ), //'org_29w9IfBrPmcpi0IeBVaKtA7R94W',
  totalPendingInvitations: integer('total_pending_invitations'), //3,
  totalPendingSuggestions: integer('total_pending_suggestions'), //10,
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  verificationAttempts: integer('verification_attempts'), //1,
  verificationExpireAt: timestamp('verification_expire_at', {
    withTimezone: true,
  }), //1654014189392,
  verificationStatus: varchar('verification_status', { length: 256 }), //'verified',
  verificationStrategy: varchar('verification_strategy', { length: 256 }), //'from_affiliation_email_code',
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const organizationDomainsRelations = relations(
  organizationDomains,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationDomains.organizationId],
      references: [organizations.id],
    }),
  }),
);
