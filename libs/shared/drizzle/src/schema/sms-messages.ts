import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

export const smsMessages = pgTable('sms_messages', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'sms_abcd',
  appDomainName: varchar('app_domain_name', { length: 256 }), //'measured.pelican-67.lcl.dev',
  appLogoImageUrl: text('app_logo_image_url'), //https://img.clerk.com/xxxxxx',
  appLogoUrl: text('app_logo_url'), //null,
  appName: varchar('app_name', { length: 256 }), //'Acme',
  appUrl: text('app_url'), //'https://accounts.measured.pelican-67.lcl.dev',
  otpCode: varchar('otp_code', { length: 256 }), //'123456',
  // user: {
  //   public_metadata: {},
  //   public_metadata_fallback: '',
  // },
  deliveredByClerk: boolean('delivered_by_clerk'), //true,
  fromPhoneNumber: varchar('from_phone_number', { length: 256 }), //'15556667777',
  message: text('message'), //'123456 is your Acme verification code and it will expire in...',
  phoneNumberId: varchar('phone_number_id', { length: 256 }), //'idn_abcd',
  slug: varchar('slug', { length: 256 }), //'verification_code',
  status: varchar('status', { length: 256 }), //'queued',
  toPhoneNumber: varchar('to_phone_number', { length: 256 }), //'+15557778888',
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

export const smsMessagesRelations = relations(smsMessages, ({ one }) => ({
  user: one(users, {
    fields: [smsMessages.userId],
    references: [users.id],
  }),
}));
