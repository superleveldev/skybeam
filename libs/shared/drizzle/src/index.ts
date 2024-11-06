import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export const generateDbConnection = ({
  databaseUrl,
}: {
  databaseUrl: string;
}) => {
  const sql = neon(databaseUrl ?? 'postgres://user:pass@host/db');

  return drizzle(sql, {
    schema,
  });
};

export * from './schema';
