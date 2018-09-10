const Expense = require('../models/ExpenseModel');
const { expenseListProj } = require('../utils/projections/expenseProjections');

exports.getExpenses = async function (req, res, next) {
  // Obter parâmetros da requisição
  const { page = 0, perPage = 5, ...query } = req.query;

  // Encontrar as despesas do deputado de acordo com os parâmetros e a página requisitada
  const [ total, expenses ] = await Promise.all([
    Expense.find(query, expenseListProj).countDocuments(),
    Expense.find(query, expenseListProj).paginate(page, perPage).sort('-date')
  ]);

  // Calcular quantas páginas existem
  const pages = Math.ceil(total / perPage);

  // Retornar a resposta de acordo com as despesas encontradas
  if(expenses && expenses.length) {
    res.status(201)
    return res.send({ expenses: expenses, total: total, pages: pages });
  }

  res.status(200)
  return res.send({ message: 'Despesas não encontradas' });
}