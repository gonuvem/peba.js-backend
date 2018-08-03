const Politico = require('../models/PoliticoModel');

const {
  getDeputadosLista, getTodosDeputados,
  getSenadoresEmExercicio, getDetalhesTodosSenadores
} = require('../services/coletorService');

const {
  getDeputadosIds, getSenadoresCodigos,
  gerarPoliticosDeDeputados, gerarPoliticosDeSenadores,
} = require('../services/parserService');

const {
  updatePoliticos
} = require('../services/updaterService');
const mongoose = require('mongoose');

describe('Testar Updater Service', () => {

  let senadores = [];
  let deputados = [];
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

    let l = await getSenadoresEmExercicio();
    let i = await getSenadoresCodigos(l);
    let d = await getDetalhesTodosSenadores(i.slice(0,3));
    let p = await gerarPoliticosDeSenadores(d);
    senadores = p;

    l = await getDeputadosLista();
    i = await getDeputadosIds(l);
    d = await getTodosDeputados(i.slice(0,3))
    p = await gerarPoliticosDeDeputados(d);
    deputados = p;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('Testar updatePoliticos', () => {

    test('Dados undefined', () => {
      return updatePoliticos(undefined).catch(error =>
        expect(error).toBeDefined());
    });

    test('Inserir 6 politicos - 3 senadores e 3 deputados', () => {
      return updatePoliticos(senadores.concat(deputados)).then( async () => {
        const totalDeputados = await Politico.countDocuments();
        expect(totalDeputados).toBe(6)
      });
    });


  });

});
