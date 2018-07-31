const Deputado = require('../models/DeputadoModel');

const {
  getDeputadosIds, getTodosDeputados,
} = require('../services/coletorService');

const {
  updateDeputados
} = require('../services/updaterService');
const mongoose = require('mongoose');

describe('Testar Updater Service', () => {

  let deputadosIds;
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    deputadosIds = await getDeputadosIds();
    deputados = await getTodosDeputados(deputadosIds.slice(0,3));
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
        const totalDeputados = await Deputado.countDocuments();
        expect(totalDeputados).toBe(3)
      });
    });

  });

});
