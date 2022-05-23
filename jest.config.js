module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2019'
      }
    }
  },
  moduleNameMapper: {
    '^@\/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: [
    '<rootDir>/test/setup.ts',
  ],
};
