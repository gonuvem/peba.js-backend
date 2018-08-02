const fastXmlParser = require('fast-xml-parser');
const {
  getDeputadosIds, getDeputadoById, getTodosDeputados,
  getDespesasByDeputadoId, getDespesasTodosDeputados,
} = require('../services/coletorService');

const deputado = {
  id: 178957,
  dataNascimento: '1962-03-29',
  nomeCivil: 'ABEL SALVADOR MESQUITA JUNIOR'
}

describe('Testar Coletor Service', () => {

  let deputadosIds;
  beforeAll(async () => {
    deputadosIds = await getDeputadosIds();
  });

  describe('Testar getDeputadosIds', () => {

    test('É um array', () => {
      expect(deputadosIds).toBeInstanceOf(Array)
    });

    test('Tem 513 ids', () => {
      expect(deputadosIds).toHaveLength(513)
    });

  });

  describe('Testar getDeputadoById', () => {

    test('Id undefined', () => {
      return getDeputadoById(undefined).catch(error => {
        expect(error.statusCode).toBe(404)
      });
    });

    test('Id válido', () => {
      return getDeputadoById(deputado.id).then(response => {
        expect(response.dados).toMatchObject(deputado)
      });
    });

  });


  describe('Testar getTodosDeputados', () => {

    test('Sem ids, lista de deputados vazia', () => {
      return getTodosDeputados([]).then(response => {
        expect(response).toEqual([])
      });
    });

    test('3 ids - 3 deputados', () => {
      return getTodosDeputados(deputadosIds.slice(0,3)).then(response => {
        expect(response).toHaveLength(3)
      });
    });

  });

  describe('Testar getDespesasByDeputadoId', () => {

    test('Id undefined - 400 Bad Request', () => {
      return getDespesasByDeputadoId(undefined).catch(error => {
        expect(error.statusCode).toBe(400)
      });
    });

    test('Despesas encontradas', () => {
      return getDespesasByDeputadoId(deputado.id).then(response => {
        expect(response).toBeDefined()
      });
    });

  });

  describe('Testar getDespesasTodosDeputados', () => {

    test('Sem ids, lista de despesas vazia', () => {
      return getDespesasTodosDeputados([]).then(response => {
        expect(response).toEqual([])
      });
    });

    test('Despesas de 3 deputados', () => {
      return getDespesasTodosDeputados(deputadosIds.slice(0,3))
      .then(response => {
        expect(response).toHaveLength(3)
      });
    });
    
  });

});
