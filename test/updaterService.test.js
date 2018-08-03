const Politico = require('../models/PoliticoModel');

const {
  getDeputadosIds, getTodosDeputados, getSenadoresEmExercicio,
  getDetalhesTodosSenadores
} = require('../services/coletorService');

const {
  updateDeputados, updateSenadores
} = require('../services/updaterService');
const mongoose = require('mongoose');

describe('Testar Updater Service', () => {

  let deputadosIds;
  let deputados;
  let senadores;
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    deputadosIds = await getDeputadosIds();
    deputados = await getTodosDeputados(deputadosIds.slice(0,3));
    const senResp = await getSenadoresEmExercicio();
    const senLista = 
    senResp.ListaParlamentarEmExercicio.Parlamentares.Parlamentar;
    const codSenadores = 
    senLista.map(sen => sen.IdentificacaoParlamentar.CodigoParlamentar);
    senadores = await getDetalhesTodosSenadores(codSenadores);
  });

  beforeEach(async () => {
    await Politico.remove({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('Testar updateDeputados', () => {

    test('Dados undefined', () => {
      return updateDeputados(undefined).catch(error =>
        expect(error).toBeDefined());
    });

    test('Inserir 3 deputados', () => {
      return updateDeputados(deputados).then( async () => {
        const totalDeputados = await Politico.countDocuments();
        expect(totalDeputados).toBe(3)
      });
    });

  });

  describe('Testar updateSenadores', () => {
    
    test('Dados undefined', () => {
      return updateSenadores(undefined).catch(error =>
        expect(error).toBeDefined());
    });

    test('Inserir 3 senadores', () => {
      return updateSenadores(senadores.slice(0,3)).then( async () => {
        const totalSenadores = await Politico.countDocuments();
        expect(totalSenadores).toBe(3)
      });
    });
    
  });

});
