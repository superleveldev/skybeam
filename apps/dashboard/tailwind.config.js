const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  content: [
    join(__dirname, './src/**/*.{js,ts,jsx,tsx,md,mdx}'),
    join(__dirname, './pages/**/*.{js,ts,jsx,tsx,md,mdx}'),
    join(__dirname, './components/**/*.{js,ts,jsx,tsx,md,mdx}'),
    join(__dirname, './apps/**/*.{js,ts,jsx,tsx,md,mdx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [
    require(join(__dirname, '../../libs/shared/ui-kit/tailwind.config.v1')),
  ],
};
