import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1440,
  viewportHeight: 950,
  scrollBehavior: 'center',
  e2e: {
    baseUrl: 'http://localhost:3002',
    specPattern: '**/*.feature',
    supportFile: '**/src/support/e2e.ts',
    projectId: '1t5qve',
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ): Promise<Cypress.PluginConfigOptions> {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );
      return config;
    },
  },
});
