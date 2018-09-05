const mongoose = require('mongoose');
require('../models/PoliticoModel');

const ExpenseSchema = new mongoose.Schema({
  year: Number,
  month: Number,
  type: String,
  provider: {
    cnpjCpf: String,
    name: String
  },
  code: String,
  date: Date,
  value: String,
  politicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Politico'
  }
});

/**
 * Faz a paginação dos resultados segundo uma quantidade de resultados por
 * página e o número da página. Considera que a numeração inicia no 0.
 * @param {Number} page Numéro da página.
 * @param {Number} perPage Quantidade de resultados por página.
 */
ExpenseSchema.query.paginate = function(page, perPage) {
  return this.skip(page * perPage).limit(perPage);
}

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;