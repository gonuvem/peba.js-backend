const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');

// Rotas
const baseRoute = '/expenses';
const idNotFound = '9b7419fcfc38c7964a15c287'

describe('Test Expense Controller', () => {

  describe('GET /expenses', () => {

    test('400 Missing politicianId', () => {
      return request(app).get(baseRoute).query().send()
        .then(response => {
          expect(response.statusCode).toBe(400)
        })
    });

    test('400 PoliticianId invalid format', () => {
      return request(app).get(baseRoute).query({ politicianId: 'abc' }).send()
        .then(response => {
          expect(response.statusCode).toBe(400)
        })
    });

    test('200 Empty Expenses', () => {
      return request(app).get(baseRoute).query({ politicianId: idNotFound }).send()
        .then(response => {
          expect(response.statusCode).toBe(200)
        })
    });

  });

});
