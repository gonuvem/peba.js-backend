const mongoose = require('mongoose');
const { updateExpensesTask } = require('./scheduler');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(updateExpensesTask())
.catch(error => console.log(error))