const mongoose = require('mongoose');
const { updateTotalExpenditureTask } = require('./scheduler');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(updateTotalExpenditureTask())
.catch(error => console.log(error))

process.exit();