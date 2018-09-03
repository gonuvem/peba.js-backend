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

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;