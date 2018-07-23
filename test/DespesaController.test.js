const app = require('../app');
const request = require('supertest');

// Rotas
const baseRoute = '/despesas';

describe('Test Despesa Controller', () => {
    
    describe('GET /despesas', () => {

        test('200 Initial test', () => {
            return request(app).get(baseRoute).send()
            .then(response => {
                expect(response.statusCode).toBe(200)
            })
        });
    });
    
});
