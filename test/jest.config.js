process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://db:27017/pebatest';

module.exports = {
  setupTestFrameworkScriptFile: './jest.setup.js',
  //globalSetup: './globalSetup.js',
  globalTeardown: './globalTeardown.js',
  testEnvironment: './customEnvironment.js',
  verbose: true,
}