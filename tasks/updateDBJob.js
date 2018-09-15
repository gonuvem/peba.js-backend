const mongoose = require('mongoose');
const { updateTask } = require('./scheduler');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(updateTask())
.catch(error => console.log(error))