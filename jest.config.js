module.exports = {
  preset: 'jest-expo',

  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
