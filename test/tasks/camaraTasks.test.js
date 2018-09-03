const {
  updateDeputadosExpensesTask, updateDeputadosFrequency, updateDeputadosTask,
  updateDeputadosTotalExpenditureTask,
} = require('../../tasks/camaraTasks');

describe('Tests Camara Tasks', () => {

  describe('Tests updateDeputadosExpensesTask', () => {
    test.skip('At least one upserted expense', () => {
      return updateDeputadosExpensesTask(1).then(result => {
        expect(result).toBeGreaterThanOrEqual(1)
      });
    }, 100000);
  });

});