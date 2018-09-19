const mongoose = require('mongoose');
const { updatePoliticiansFrequencyTask } = require('./scheduler');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(updatePoliticiansFrequencyTask())
.catch(error => console.log(error))