const {
  getSenadoresList, getSenadorDetail, getSenadoresExpensesCsv
} = require('../../../services/senado/senadoColector');

const senador = {
  CodigoParlamentar: '4981',
  NomeParlamentar: "Acir Gurgacz",
  NomeCompletoParlamentar: "Acir Marcos Gurgacz",
}

describe('Tests Senado Colector Service', () => {

  describe('Tests getSenadoresList', () => {
    test('At least 81 senadores by legislature', () => {
      return getSenadoresList().then(response => {
        const senadores = 
        response.ListaParlamentarLegislatura.Parlamentares.Parlamentar;
        expect(senadores.length).toBeGreaterThanOrEqual(81)
      });
    });
  });

  describe('Tests getSenadorDetail', () => {

    test('Undefined code - 404 Not found', () => {
      return getSenadorDetail(undefined).catch(error => 
        expect(error.statusCode).toBe(404));
    });

    test('Senador Acir detail', () => {
      return getSenadorDetail(senador.CodigoParlamentar).then(response => {
        const detail = 
        response.DetalheParlamentar.Parlamentar.IdentificacaoParlamentar;
        expect(detail).toMatchObject(senador)
      });
    });

  });

  describe('Tests getSenadoresExpensesCsv', () => {
    test('It is defined', () => {
      return getSenadoresExpensesCsv().then(response => {
        expect(response).toBeDefined()
      });
    });
  });

});