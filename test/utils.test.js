const { toTitleCase, montarEndereco } = require('../utils/utils');

describe.only('Testar utils', () => {

  describe('Testar toTitleCase', () => {

    test('Frase toda minúscula sem acentos', () => {
      const res = toTitleCase('frase sem acentos');
      expect(res).toBe('Frase Sem Acentos')
    });

    test('Frase toda minúscula com acentos', () => {
      const res = toTitleCase('armazém holandês joão põe saúde táxi');
      expect(res).toBe('Armazém Holandês João Põe Saúde Táxi')
    });

    /*
    test('Frase toda minúscula com acentos no início', () => {
      const res = toTitleCase('átila úrsula ângelo édson');
      expect(res).toBe('Átila Úrsula Ângelo Édson')
    });
    */

    test('Frase toda maiúscula sem acentos', () => {
      const res = toTitleCase('FRASE SEM ACENTOS');
      expect(res).toBe('Frase Sem Acentos')
    });

    test('Frase toda maiúscula com acentos', () => {
      const res = toTitleCase('ARMAZÉM HOLANDÊS JOÃO PÕE SAÚDE TÁXI');
      expect(res).toBe('Armazém Holandês João Põe Saúde Táxi')
    });

    /*
    test('Frase toda maiúscula com acentos no início', () => {
      const res = toTitleCase('ÁTILA ÚRSULA ÂNGELO ÉDSON');
      expect(res).toBe('Átila Úrsula Ângelo Édson')
    });
    */

  });

  describe('Testar montarEndereco', () => {

    const gabinete1 = {
      nome: '35',
      predio: 'A',
      sala: '23',
      andar:  '2'
    };

    test('Endereço completo', () => {
      const res = montarEndereco(gabinete1);
      expect(res).toBe('Gabinete 35, Prédio A, Sala 23, Andar 2')
    });

  });

});

/*
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

*/