const Expense = require('../models/ExpenseModel');
const { expenseListProj } = require('../utils/projections/expenseProjections');

exports.getExpenses = async function (req, res, next) {
  // Obter parâmetros da requisição
  const query = req.query;

  // Encontrar as despesas do deputado de acordo com os parâmetros
  const expenses = await Expense.find(query, expenseListProj);

  // Retornar a resposta de acordo com as despesas encontradas
  if(expenses && expenses.length) {
    res.status(201)
    return res.send(expenses);
  }

  res.status(200)
  return res.send('Despesas não encontradas');
}