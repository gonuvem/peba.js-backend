const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');

// Rotas
const baseRoute = '/politicos';

describe('Test Politico Controller', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  });

  describe('GET /politicos', () => {

    test('Políticos piauienses', () => {
      return request(app).get(`${ baseRoute }/PI`).send()
        .then(response => {
          expect(response.statusCode).toBe(200)
        })
    });

  });

});
