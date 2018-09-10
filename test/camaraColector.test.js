const { 
  getDeputadosListV2, getDeputadoDetail, getDeputadoExpenses,
  getDeputadoFrequency, getDeputadosListV1,
} = require('../services/camara/camaraColector');

const deputado = {
  id: 178957,
  nomeCivil: 'ABEL SALVADOR MESQUITA JUNIOR'
}

describe('Tests CamaraColector Service', () => {

  let deputadosListV2;
  let deputadosIds;
  beforeAll(async () => {
    deputadosListV2 = await getDeputadosListV2();
    //deputadosIds = await getDeputadosIds(deputadosListV2);
  });

  describe('Tests getDeputadosListV2', () => {

    test('It is an array', () => {
      expect(deputadosListV2).toBeInstanceOf(Array)
    })

  });

  describe('Tests getDeputadoDetail', () => {

    test('Undefined id', () => {
      return getDeputadoDetail(undefined).catch(error => {
        expect(error.statusCode).toBe(404)
      });
    });

    test('Valid id', () => {
      return getDeputadoDetail(deputado.id).then(response => {
        expect(response.dados).toMatchObject(deputado)
      });
    });

  });

  describe('Tests getDeputadoExpenses', () => {

    test('It is an array', () => {
      return getDeputadoExpenses(deputado.id).then(response => {
        expect(response.expenses).toBeInstanceOf(Array)
      });
    });
    
  });

  describe('Tests getDeputadosListV1', () => {

    test('It is a xml response', () => {
      return getDeputadosListV1().then(response => {
        expect(response).toContain('<?xml')
      });
    });
    
  });

  describe('Tests getDeputadoFrequency', () => {

    test('It is a xml response', () => {
      return getDeputadoFrequency(312).then(response => {
        expect(response).toContain('<?xml')
      });
    });
    
  });

});
