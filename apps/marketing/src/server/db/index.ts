import { env } from '../../env';
import { generateDbConnection } from '@limelight/shared-drizzle';

export const db = generateDbConnection({
  databaseUrl: env.DATABASE_URL ?? 'postgres://user:pass@host/db',
});

// export type definition of API
export type DrizzleDB = typeof db;
