const NodeEnvironment = require('jest-environment-node');
const mongoose = require('mongoose');

class CustomEnvironment extends NodeEnvironment {

  constructor(config) {
    super(config);
  }

  async	setup() {
    await super.setup();
    /*await mongoose.connect('mongodb://db:27017/pebatest',
  { useNewUrlParser: true });*/
  }

  async	teardown() {
    await super.teardown();
    //await mongoose.disconnect();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;