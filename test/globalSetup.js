const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect('mongodb://db:27017/pebatest',
  { useNewUrlParser: true });
};