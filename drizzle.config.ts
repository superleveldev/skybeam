import { type Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
dotenv.config({
  path: join(__dirname, './libs/shared/drizzle/.env.local'),
  override: true,
});

export default {
  schema: './libs/shared/drizzle/src/schema/*',
  out: './libs/shared/drizzle/src/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  dialect: 'postgresql',
  breakpoints: true,
  strict: false,
  verbose: true,
} satisfies Config;
