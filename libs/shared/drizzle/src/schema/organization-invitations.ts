import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { organizations } from './organizations';

export const organizationInvitations = pgTable('organization_invitations', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'orginv_29wBIniWYy0slasTNQlmHD9HeN1'
  emailAddress: varchar('email_address', { length: 256 }), //'example@example.org',
  organizationId: varchar('organization_id', { length: 256 }).references(
    () => organizations.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ), //'org_29w9IfBrPmcpi0IeBVaKtA7R94W',
  role: varchar('role', { length: 256 }), //'basic_member',
  status: varchar('status', { length: 256 }), //'accepted',
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const organizationInvitationsRelations = relations(
  organizationInvitations,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationInvitations.organizationId],
      references: [organizations.id],
    }),
  }),
);
