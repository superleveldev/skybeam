const { getJestProjects } = require('@nx/jest');

export default {
  projects: getJestProjects(),
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
};
