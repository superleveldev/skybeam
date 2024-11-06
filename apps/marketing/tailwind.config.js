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
  theme: {
    screens: {
      mobile: '320px',
      tablet: '568px',
      laptop: '960px',
      desktop: '1440px',
    },
    extend: {
      fontFamily: {
        franklin: ['"Franklin Gothic"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        gelica: ['"Gelica Lt"', 'sans-serif'],
        proximaNova: ['"Proxima Nova"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        background: {
          DEFAULT: 'hsl(var(--background))',
        },
      },
      backgroundImage: {
        'lime-gradient': 'linear-gradient(180deg, #FAF9F6 26%, #D7FC6E 100%)',
      },
    },
  },
};
