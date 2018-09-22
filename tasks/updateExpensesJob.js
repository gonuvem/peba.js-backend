const { updateExpensesTask } = require('./scheduler');
const { executeTask } = require('../utils/utils');

executeTask(updateExpensesTask);