const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/unit'],
  moduleNameMapper: {
    '^@site/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
  testMatch: ['**/tests/unit/**/*.test.(ts|tsx)'],
};
