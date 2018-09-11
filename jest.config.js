module.exports = {
  // setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironment: 'node',
  verbose: false,
  silent: false,
  transform: {
    '^.+\\.jsx?$': 'babel-7-jest',
  },
}
