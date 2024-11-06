import { pgEnum } from 'drizzle-orm/pg-core';

export const budgetTypeEnum = pgEnum('budget_type', ['daily', 'lifetime']);
