const {
  getDeputadosListV2, getDeputadoDetail, getDeputadoExpenses,
  getDeputadosListV1, getDeputadoFrequency
} = require('../../../services/camara/camaraColector');
const {
  getDeputadosIds, createPoliticiansFromDeputados, parseDeputadosExpenses,
  getDeputadosTotalExpenditure, getDeputadosRegistration, parseFrequency
} = require('../../../services/camara/camaraParser');

const deputado = {
  id: 178957,
  nome: 'Abel Mesquita Jr.'
}

const deputado2 = {
  mat: 312
}

describe('Tests Camara Parser Service', () => {

  let deputadosListV2;
  let deputadoDetail;
  let deputadoExpenses;
  let deputadoFrequency;
  beforeAll(async () => {
    deputadosListV2 = await getDeputadosListV2();
    deputadoDetail = await getDeputadoDetail(deputado.id);
    deputadoExpenses = await getDeputadoExpenses(deputado.id);
    deputadosListV1 = await getDeputadosListV1();
    deputadoFrequency = await getDeputadoFrequency(deputado2.mat);
  });

  describe('Tests getDeputadosIds', () => {
    
    test('More than 513 deputados', () => {
      return getDeputadosIds(deputadosListV2).then(response => {
        expect(response.length).toBeGreaterThanOrEqual(513)
      });
    });

  });

  describe('Tests createPoliticiansFromDeputados', () => {

    test('Deputado Abel Mesquita', () => {
      return createPoliticiansFromDeputados([deputadoDetail])
      .then(response => {
        expect(response[0].nome).toBe(deputado.nome)
      });
    });

  });

  describe('Tests parseDeputadosExpenses', () => {

    test('Deputados Expenses', () => {
      return parseDeputadosExpenses([deputadoExpenses]).then(response => {
        expect(response[0].codigo).toBe(deputado.id)
      });
    });

  });

  describe('Tests getDeputadosTotalExpenditure', () => {

    test('Deputados Total Expenditure', async () => {
      const expenses = await parseDeputadosExpenses([deputadoExpenses])
      return getDeputadosTotalExpenditure(expenses).then(response => {
        expect(response[0].codigo).toBe(deputado.id)
      });
    });

  });

  describe('Tests getDeputadosRegistration', () => {

    test('513 registrations', () => {
      return getDeputadosRegistration(deputadosListV1).then(response => {
        expect(response.length).toBe(513)
      });
    });

  });

  describe('Tests parseFrequency', () => {

    test('Registration number', () => {
      return parseFrequency(deputadoFrequency).then(response => {
        expect(response.matricula).toBe(deputado2.mat)
      });
    });

  });

});