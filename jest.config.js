module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['lib/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.js'],
};
