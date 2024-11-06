const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { join } = require('path');

module.exports = {
  presets: [
    require('../../../tailwind-workspace-preset'),
    require(join(__dirname, './tailwind.config.v1')),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  content: [
    join(__dirname, './src/**/*.{js,ts,jsx,tsx,md,mdx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
