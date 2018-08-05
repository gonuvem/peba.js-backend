const {
  getDeputadosLista, getDeputadoById, getTodosDeputados,
  getDespesasByDeputadoId, getDespesasTodosDeputados,
  getSenadoresEmExercicio, getDetalhesSenador, getDetalhesTodosSenadores,
} = require('../services/coletorService');

const {
  getDeputadosIds, getSenadoresCodigos
} = require('../services/parserService');

const deputado = {
  id: 178957,
  dataNascimento: '1962-03-29',
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

  describe('Testar getSenadoresEmExercicio', () => {

    test('São 81 senadores em exercício', () => {
      return getSenadoresEmExercicio().then( async response => {
        const senadores = await getSenadoresCodigos(response);
        expect(senadores).toHaveLength(81)
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

});
