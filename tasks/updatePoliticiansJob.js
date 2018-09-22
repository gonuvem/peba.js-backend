const { updatePoliticiansTask } = require('./scheduler');
const { executeTask } = require('../utils/utils');

executeTask(updatePoliticiansTask);