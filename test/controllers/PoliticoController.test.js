const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');

// Rotas
const baseRoute = '/politicos';

describe('Test Politico Controller', () => {

  describe('GET /politicos', () => {

    test('Políticos piauienses', () => {
      return request(app).get(baseRoute).query({ uf: 'PI' }).send()
        .then(response => {
          expect(response.statusCode).toBe(200)
        })
    });

  });

});
