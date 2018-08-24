const {
  getDeputadosLista, getDeputadoById, getTodosDeputados,
  getTodasDespesasDeputado, getTodasDespesasTodosDeputados,
  getSenadoresLegislatura, getDetalhesSenador, getDetalhesTodosSenadores,
  getDespesasSenadoresCsv
} = require('../services/coletorService');

const {
  getDeputadosIds, getSenadoresCodigos
} = require('../services/parserService');

const deputado = {
  id: 178957,
  nomeCivil: 'ABEL SALVADOR MESQUITA JUNIOR'
}

const senador = {
  CodigoParlamentar: '4981',
  NomeParlamentar: "Acir Gurgacz",
  NomeCompletoParlamentar: "Acir Marcos Gurgacz",
}

const codSenadores = ['5322', '3695', '5000'];

describe('Testar Coletor Service', () => {

  let deputadosLista;
  let deputadosIds;
  beforeAll(async () => {
    deputadosLista = await getDeputadosLista();
    deputadosIds = await getDeputadosIds(deputadosLista);
  });

  describe('Testar getDeputadosLista', () => {

    test('É um array', () => {
      expect(deputadosLista).toBeInstanceOf(Array)
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

  describe('Testar getTodasDespesasDeputado', () => {

    test('Id undefined - 400 Bad Request', () => {
      return getTodasDespesasDeputado(undefined).catch(error => {
        expect(error.statusCode).toBe(400)
      });
    });

    test('Despesas encontradas', () => {
      return getTodasDespesasDeputado(deputado.id).then(response => {
        expect(response).toBeDefined()
      });
    });

  });

  describe('Testar getTodasDespesasTodosDeputados', () => {

    test('Sem ids, lista de despesas vazia', () => {
      return getTodasDespesasTodosDeputados([]).then(response => {
        expect(response).toEqual([])
      });
    });

    test('Despesas de 3 deputados', () => {
      return getTodasDespesasTodosDeputados(deputadosIds.slice(0,3))
      .then(response => {
        expect(response).toHaveLength(3)
      });
    });
    
  });

  describe('Testar getSenadoresLegislatura', () => {

    test('São pelo menos 81 senadores em um legislatura', () => {
      return getSenadoresLegislatura().then( async response => {
        const senadores = await getSenadoresCodigos(response);
        expect(senadores.length).toBeGreaterThanOrEqual(81)
      });
    });

  });

  describe('Testar getDetalhesSenador', () => {

    test('Código undefined - 404 Not found', () => {
      return getDetalhesSenador(undefined).catch(error => 
        expect(error.statusCode).toBe(404));
    });

    test('Detalhes encontrados - Senador Acir', () => {
      return getDetalhesSenador(senador.CodigoParlamentar).then(response => {
        const detalhes = 
        response.DetalheParlamentar.Parlamentar.IdentificacaoParlamentar;
        expect(detalhes).toMatchObject(senador)
      });
    });

  });

  describe('Testar getDetalhesTodosSenadores', () => {

    test('Codigos vazios - Lista vazia', () => {
      return getDetalhesTodosSenadores([]).then(response => {
        expect(response).toEqual([])
      });
    });

    test('3 codigos - 3 senadores', () => {
      return getDetalhesTodosSenadores(codSenadores).then(detalhes => {
        expect(detalhes).toHaveLength(3)
      });
    });

  });

  describe('Testar getDespesasSenadoresCsv', () => {
  });

});
