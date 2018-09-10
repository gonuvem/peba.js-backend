const {
  getSenadoresList, getSenadorDetail, getSenadoresExpensesCsv
} = require('../../../services/senado/senadoColector');
const {
  getSenadoresIds, createPoliticiansFromSenadores, parseSenadoresExpenses,
  getSenadoresTotalExpenditure
} = require('../../../services/senado/senadoParser');

const senador = {
  id: '5322',
  nome: 'Romario'
}

describe('Tests Senado Parser Service', () => {

  let senadoresList;
  let senadorDetail;
  let expensesCsv;
  beforeAll(async () => {
    senadoresList = await getSenadoresList();
    senadorDetail = await getSenadorDetail(senador.id);
    expensesCsv = await getSenadoresExpensesCsv();
  });

  describe('Tests getSenadoresIds', () => {

    test('At least 81 ids', () => {
      return getSenadoresIds(senadoresList).then(response => {
        expect(response.length).toBeGreaterThanOrEqual(81)
      });
    });

  });

  describe('Tests createPoliticiansFromSenadores', () => {

    test('Senador Romario', () => {
      return createPoliticiansFromSenadores([senadorDetail]).then(response => {
        expect(response[0].nome).toBe(senador.nome)
      });
    });

  });

  describe('Tests parseSenadoresExpenses', () => {

    test('Data is defined', () => {
      return parseSenadoresExpenses(expensesCsv).then(response => {
        expect(response.data).toBeDefined()
      });
    });

  });

  describe('Tests getSenadoresTotalExpenditure', () => {

    test('Total expenditure is defined', async () => {
      const expenses = await parseSenadoresExpenses(expensesCsv);
      return getSenadoresTotalExpenditure(expenses).then(response => {
        expect(response[0].totalDespesas).toBeDefined()
      });
    });

  });

});