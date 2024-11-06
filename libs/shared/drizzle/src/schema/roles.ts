import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const roles = pgTable('roles', {
  id: varchar('id', { length: 256 }).primaryKey().notNull(), //'role_2Ym4Iu9JcfMpa4wsTmsRgnY83MX',
  description: text('description'), //'My custom role',
  isCreatorEligible: boolean('is_creator_eligible'), //false,
  key: varchar('key', { length: 256 }), //'org:my_custom_role',
  name: varchar('name', { length: 256 }), //'custom role',
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
