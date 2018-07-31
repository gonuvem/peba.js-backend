const {
  validarXml,
  converterXmlParaJson,
} = require('../services/parserService');

const {
  recuperarDeputados,
} = require('../services/coletorService');

const sampleXml = `
<dados>
    <deputado_>
      <id>178957</id>
      <uri>https://dadosabertos.camara.leg.br/api/v2/deputados/178957</uri>
      <nome>ABEL MESQUITA JR.</nome>
      <siglaPartido>DEM</siglaPartido>
      <uriPartido>https://dadosabertos.camara.leg.br/api/v2/partidos/36769</uriPartido>
      <siglaUf>RR</siglaUf>
      <idLegislatura>55</idLegislatura>
      <urlFoto>http://www.camara.leg.br/internet/deputado/bandep/178957.jpg</urlFoto>
    </deputado_>
</dados>    
`;

describe('Testar Parser Service', () => {

  describe('Testar validarXml', () => {    

    test('Arquivo vazio', () => {
      return validarXml('').catch(e =>
        expect(e).toEqual(new Error('Não é um arquivo XML')));
    });

    test('Arquivo inválido', () => {
      return validarXml('String não xml').catch(e =>
        expect(e).toEqual(new Error('Não é um arquivo XML')));
    });

    test('Arquivo é um xml', () => {
      return validarXml(sampleXml).then(response =>
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

    test('Conversão bem sucedida', () => {
      return converterXmlParaJson(sampleXml).then(response =>
        expect(response).toMatchObject({
          dados: {
            deputado_: {
              id: 178957,
              nome: 'ABEL MESQUITA JR.'
            }
          }
        }));
    });

  });

});
