import { clerkSetup } from '@clerk/testing/cypress';
import { defineConfig } from 'cypress';

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  projectId: 'okoxkj',
  viewportHeight: 800,
  viewportWidth: 1280,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    testUserEmail: process.env.TEST_USER_EMAIL,
    testUserPassword: process.env.TEST_USER_PASSWORD,
  },
  defaultCommandTimeout: 60000,
  e2e: {
    specPattern: './src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/e2e.ts',
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
    },
    baseUrl: 'http://localhost:3001',
  },
  scrollBehavior: 'center',
});
