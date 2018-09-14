const mongoose = require('mongoose');
const { updateTask } = require('./scheduler');

mongoose.connect('mongodb://db:27017/pebatest', { useNewUrlParser: true });

updateTask();