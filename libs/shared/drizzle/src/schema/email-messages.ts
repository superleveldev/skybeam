import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

export const emailMessages = pgTable('email_messages', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(),
  body: text('body'), //'<html stuff>',
  bodyPlain: text('body_plain'), //'123456 is your OTP code for Acme.\n\nDo not share this email.\n',
  appDomainName: text('app_domain_name'), //'uncommon.dolphin-15.lcl.dev',
  appLogoImageUrl: text('app_logo_image_url'), //'https://img.clerk.com/xxxxxx',
  appLogoUrl: text('app_logo_url'), //null,
  appName: text('app_name'), //'Acme',
  appUrl: text('app_url'), //'https://accounts.uncommon.dolphin-15.lcl.dev',
  otpCode: varchar('otp_code', { length: 256 }), //'123456',
  requestedAt: timestamp('requested_at', { withTimezone: true }), //'30 August 2022, 12:14 UTC',
  requestedBy: varchar('requested_by', { length: 256 }), //'Chrome, OS X',
  themeButtonTextColor: varchar('theme_button_text_color', { length: 10 }), //'#ffffff',
  themePrimaryColor: varchar('theme_primary_color', { length: 10 }), //'#335bf1',
  themeShowClerkBranding: boolean('theme_show_clerk_branding'), //true,
  // public_metadata: {},
  // public_metadata_fallback: '',
  deliveredByClerk: boolean('delivered_by_clerk'), //true,
  emailAddressId: varchar('email_address_id', { length: 256 }), //'idn_abcd',
  fromEmailName: varchar('from_email_name', { length: 256 }), //'notifications',
  slug: varchar('slug', { length: 256 }), //'verification_code',
  source: varchar('source', { length: 256 }), // example: clerk, inngest, etc.
  status: varchar('status', { length: 256 }), //'queued',
  subject: text('subject'), //'123456 is your verification code\n',
  toEmailAddress: varchar('to_email_address', { length: 256 }), //'johndoe@acme.com',
  userId: varchar('user_id', { length: 256 }).references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }), //'user_abcd',
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const emailMessagesRelations = relations(emailMessages, ({ one }) => ({
  user: one(users, {
    fields: [emailMessages.userId],
    references: [users.id],
  }),
}));
