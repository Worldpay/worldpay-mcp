// Jest configuration for ESM and TypeScript with proper .js extension support
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    // Handle .js extensions for local imports in TypeScript files
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
};
