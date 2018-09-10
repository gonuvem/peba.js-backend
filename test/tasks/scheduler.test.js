const {
  updateExpensesTask, updatePoliticiansFrequencyTask, updatePoliticiansJob,
  updatePoliticiansTask, updateTask, updateTotalExpenditureTask
} = require('../../tasks/scheduler');

describe('Tests Scheduler', () => {

  describe('Tests updateExpensesTask', () => {
    test.skip('At least one upserted expense', () => {
      return updateExpensesTask(1).then(result => {
        expect(result).toBeGreaterThanOrEqual(1)
      });
    }, 100000);
  });

});