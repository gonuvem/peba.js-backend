const { updatePoliticiansFrequencyTask } = require('./scheduler');
const { executeTask } = require('../utils/utils');

executeTask(updatePoliticiansFrequencyTask);