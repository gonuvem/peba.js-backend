process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://db:27017/pebatest';

module.exports = {
    setupTestFrameworkScriptFile: './jest.setup.js',
    verbose : true,
}