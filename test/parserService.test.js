const {
  validarXml,
  converterXmlParaJson,
} = require('../services/parserService');

const {
  recuperarDeputados,
} = require('../services/coletorService');


describe('Testar Parser Service', () => {

  let deputadosXML;

  beforeAll(async () => {
    deputadosXML = await recuperarDeputados();
  });

  describe('Testar validarXml', () => {    

    test('Arquivo vazio', () => {
      return validarXml('').catch(e =>
        expect(e).toEqual(new Error('Não é um arquivo XML')));
    });

    test('Arquivo inválido', () => {
      return validarXml('String não xml').catch(e =>
        expect(e).toEqual(new Error('Não é um arquivo XML')));
    });

    test('Arquivo baixado', () => {
      return validarXml(deputadosXML).then(response =>
        expect(response).toBe(true));
    });

  });

  describe('Testar converterXmlParaJson', () => {
    
    test('Arquivo vazio', () => {
      return converterXmlParaJson('').catch(e => 
        expect(e).toEqual(new Error('Não é um arquivo XML')))
    });

    test('Arquivo inválido', () => {
      return converterXmlParaJson('String não xml').catch(e => 
        expect(e).toEqual(new Error('Não é um arquivo XML')))
    });

    test('Arquivo convertido', async () => {
      const json = await converterXmlParaJson(deputadosXML);
      expect(typeof json).toBe('object')  
      
    });

  });

});
