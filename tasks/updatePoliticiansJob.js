const mongoose = require('mongoose');
const { updatePoliticiansTask } = require('./scheduler');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(updatePoliticiansTask())
.catch(error => console.log(error))

process.exit();