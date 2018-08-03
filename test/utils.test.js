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