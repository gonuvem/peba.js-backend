const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/peba';

module.exports = mongoose.connect(URI, { useNewUrlParser: true }); 