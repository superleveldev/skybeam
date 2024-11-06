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
    ENABLE_POSTHOG_INNGEST_EVENTS: z.string().optional(),
    AWS_MEDIA_CONVERTER_ROLE_ARN: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    AWS_REGION: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    AWS_ROLE_ARN: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    AWS_S3_BUCKET_NAME: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    DATABASE_URL: ['production'].includes(nodeEnv)
      ? z.string().min(1).optional()
      : z.string().optional(),
    BRANCH: z.string().optional().default('local'),
    VERCEL_URL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    CLERK_SECRET_KEY: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    INNGEST_SIGNING_KEY: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    INTERCOM_ACCESS_TOKEN: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    BEESWAX_ACCOUNT_ID: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    BEESWAX_EMAIL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    BEESWAX_PASS: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    BEESWAX_URL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    HULU_INVENTORY_ID: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    TINYBIRD_BASE_URL: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    TINYBIRD_TOKEN: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    SLACK_WEBHOOK: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    STRIPE_SECRET_KEY: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    TARGETING_SEGMENTS_BASE_PATH: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
    VERCEL_ENV: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ['production'].includes(nodeEnv)
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
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ['production'].includes(nodeEnv)
      ? z.string().optional()
      : z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AWS_MEDIA_CONVERTER_ROLE_ARN: process.env.AWS_MEDIA_CONVERTER_ROLE_ARN,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ROLE_ARN: process.env.AWS_ROLE_ARN,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,
    DATABASE_URL: process.env.DATABASE_URL,
    BRANCH: process.env.VERCEL_GIT_COMMIT_REF,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    ENABLE_POSTHOG_INNGEST_EVENTS:
      process.env.ENABLE_POSTHOG_INNGEST_EVENTS === '1' ? '1' : undefined,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
    INTERCOM_ACCESS_TOKEN: process.env.INTERCOM_ACCESS_TOKEN,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    BEESWAX_ACCOUNT_ID: process.env.BEESWAX_ACCOUNT_ID,
    BEESWAX_EMAIL: process.env.BEESWAX_EMAIL,
    BEESWAX_PASS: process.env.BEESWAX_PASS,
    BEESWAX_URL: process.env.BEESWAX_URL,
    HULU_INVENTORY_ID: process.env.HULU_INVENTORY_ID,
    SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
    TINYBIRD_BASE_URL: process.env.TINYBIRD_BASE_URL,
    TINYBIRD_TOKEN: process.env.TINYBIRD_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    TARGETING_SEGMENTS_BASE_PATH: process.env.TARGETING_SEGMENTS_BASE_PATH,
    VERCEL_ENV: process.env.VERCEL_ENV,
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
