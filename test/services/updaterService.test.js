const mongoose = require('mongoose');
const Politico = require('../../models/PoliticoModel');
const {
  getDeputadosListV2, getDeputadoDetail, getDeputadoExpenses,
  getDeputadosListV1, getDeputadoFrequency
} = require('../../services/camara/camaraColector');
const {
  getDeputadosIds, createPoliticiansFromDeputados, parseDeputadosExpenses,
  getDeputadosTotalExpenditure, getDeputadosRegistration, parseFrequency
} = require('../../services/camara/camaraParser');
const {
  getSenadoresList, getSenadorDetail, getSenadoresExpensesCsv
} = require('../../services/senado/senadoColector');
const {
  getSenadoresIds, createPoliticiansFromSenadores,
  getSenadoresTotalExpenditure, parseSenadoresExpenses
} = require('../../services/senado/senadoParser');
const {
  updatePoliticiansByCode, updatePoliticiansByName
} = require('../../services/updaterService');
const { parallelPromises } = require('../../utils/utils');

describe('Testar Updater Service', () => {

  let senadores = [];
  let deputados = [];

  beforeAll(async () => {
    // TODO: Utilizar factories

    let l = await getSenadoresList();
    let i = await getSenadoresIds(l);
    let d = await parallelPromises(getSenadorDetail, i.slice(0,3));
    let p = await createPoliticiansFromSenadores(d);
    senadores = p;

    l = await getDeputadosListV2();
    i = await getDeputadosIds(l);
    d = await parallelPromises(getDeputadoDetail, i.slice(0,3))
    p = await createPoliticiansFromDeputados(d);
    deputados = p;
  });

  describe('Testar updatePoliticiansByCode', () => {

    test('Dados undefined', () => {
      return updatePoliticiansByCode(undefined).catch(error =>
        expect(error).toBeDefined());
    });

    test('Inserir 6 politicos - 3 senadores e 3 deputados', () => {
      return updatePoliticiansByCode(senadores.concat(deputados)).then( async () => {
        const totalPoliticos = await Politico.countDocuments();
        expect(totalPoliticos).toBe(6)
      });
    });


  });

});
