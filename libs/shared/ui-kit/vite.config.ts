/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/dashboard',

  plugins: [nxViteTsPaths()],
  envPrefix: 'NEXT_PUBLIC_',

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    reporters: ['default'],
    cache: {
      dir: '../../node_modules/.vitest',
    },
    globalSetup: 'vite.global.ts',
    setupFiles: 'dotenv/config',
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '/dist/coverage/dashboard',
    },
  },
});
