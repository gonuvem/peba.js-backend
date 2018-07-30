const fastXmlParser = require('fast-xml-parser');
const {
    getDeputadosIds, getTodosDeputados, getDespesasByDeputadoId, 
    getDespesasTodosDeputados,
} = require('../services/coletorService');

describe('Testar Coletor Service', () => {
    
    describe('Testar getDeputadosIds', () => {
        
        test('513 ids', () => {
            return getDeputadosIds().then(ids => {
                expect(ids).toHaveLength(513)
            });
        });

    });

    describe('Testar getTodosDeputados', () => {

    });

    describe('Testar getDespesasByDeputadoId', () => {

    });

    describe('Testar getDespesasTodosDeputados', () => {

    });
    
});
