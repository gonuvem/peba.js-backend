const fastXmlParser = require('fast-xml-parser');
const {
    recuperarDeputados,
} = require('../services/coletorService');

describe('Testar Coletor Service', () => {
    
    describe('Testar recuperarDeputados', () => {

        let dados;

        beforeAll(async () => {
            dados = await recuperarDeputados();
        });    

        test('Executou sem erros', () => {
            expect(dados).toBeDefined()
        });

        test('É uma string', () => {
            expect(typeof dados).toBe('string')
        });

        test('Os dados são do formato XML', () => {
            const isXml = fastXmlParser.validate(dados);
            expect(isXml).toBe(true)
        });

    });
    
});
