const app = require('../app');
const request = require('supertest');

// Rotas
const baseRoute = '/deputados';

describe('Test Deputado Controller', () => {
    
    describe('GET /deputados', () => {

        test('200 Initial test', () => {
            return request(app).get(baseRoute).send()
            .then(response => {
                expect(response.statusCode).toBe(200)
            })
        });

        test('Test message OK', () => {
            return request(app).get(baseRoute).send()
            .then(response => {
                expect(response.body)
                .toHaveProperty('message', 'Teste do controller de deputados')
            })
        });

    });
    
});
