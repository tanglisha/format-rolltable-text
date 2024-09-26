/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  verbose: true,
  rootDir: "./",
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverage: true,
  testMatch: ["<rootDir>/**/?(*.)test.ts"],
};