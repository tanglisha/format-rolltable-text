import { createDefaultPreset, JestConfigWithTsJest } from 'ts-jest'

export const jestConfig: JestConfigWithTsJest = {
  ...createDefaultPreset(),
  verbose: true,
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src',
    '<rootDir>/__tests__',
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  testEnvironment: 'node',
  resetMocks: true,
  restoreMocks: true
}
