import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__test__/setup.ts'],
  moduleNameMapper: {
  // FIX 1: Map uuid to the specific CJS distribution
    '^uuid$': 'uuid',
  },
  // FIX 2: Ensure Jest processes ESM files in node_modules

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: false, // Force CommonJS output for Jest
    }],
  },
  // Tell Jest to NOT ignore the uuid folder so it can be transformed if needed
  transformIgnorePatterns: [
    '/node_modules/(?!uuid)/',
  ],
};

export default config;