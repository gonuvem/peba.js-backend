const {
  recuperarDeputados,
} = require('../services/coletorService');

const {
  updateDeputados
} = require('../services/updaterService');
const mongoose = require('mongoose');

describe('Testar Updater Service', () => {

  /*
  let deputadosXML;
  let json;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    deputadosXML = await recuperarDeputados();
    json = await converterXmlParaJson(deputadosXML);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  */

  describe('Testar updateDeputados', () => {

    test('Dados undefined', () => {
      return updateDeputados(undefined).catch(e =>
        expect(e).toBeDefined());
    });

  });

});
