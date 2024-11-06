/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
export default {
  displayName: 'shared-ui-kit',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/ui-kit',
};
