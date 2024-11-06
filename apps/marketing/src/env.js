import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const unitTesting = !!process.env.VITEST;

const nodeEnv = process.env.NODE_ENV;

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    CI: z.string().optional(),
    DATABASE_URL: ['production'].includes(nodeEnv)
      ? z.string().min(1).optional()
      : z.string().optional(),
    BRANCH: z.string().optional().default('local'),
    ENABLE_POSTHOG_INNGEST_EVENTS: z.string().optional(),
    VERCEL_URL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    INNGEST_SIGNING_KEY: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    SANITY_BLOG_PROJECT_ID: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    NEXT_PUBLIC_INTERCOM_APP_ID: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_DASHBOARD_URL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    NEXT_PUBLIC_MARKETING_URL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    NEXT_PUBLIC_INTERCOM_APP_ID: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,
    DATABASE_URL: process.env.DATABASE_URL,
    ENABLE_POSTHOG_INNGEST_EVENTS:
      process.env.ENABLE_POSTHOG_INNGEST_EVENTS === '1' ? '1' : undefined,
    BRANCH: process.env.VERCEL_GIT_COMMIT_REF,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
    SANITY_BLOG_PROJECT_ID: process.env.SANITY_BLOG_PROJECT_ID,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || unitTesting,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
