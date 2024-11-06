import {createEnv} from '@t3-oss/env-nextjs'
import {z} from 'zod'

const unitTesting = !!process.env.VITEST

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION || unitTesting,
  emptyStringAsUndefined: true,
})
