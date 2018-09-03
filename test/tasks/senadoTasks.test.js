const {
  updateSenadoresExpensesTask, updateSenadoresTask,
  updateSenadoresTotalExpenditureTask
} = require('../../tasks/senadoTasks');

describe('Tests Senado Tasks', () => {

  describe('Tests updateSenadoresExpensesTask', () => {
    test.skip('At least one upserted expense', () => {
      return updateSenadoresExpensesTask(1).then(result => {
        expect(result).toBeGreaterThanOrEqual(1)
      });
    }, 100000);
  });

});