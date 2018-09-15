const Expense = require('../models/ExpenseModel');
const { expenseListProj } = require('../utils/projections/expenseProjections');
const {
  totalizeExpensesByMonth, totalizeExpensesByType, 
  totalizeExpensesByTopNProviders
} = require('../helpers/expenseHelper');

exports.getExpenses = async function (req, res, next) {
  // Obter parâmetros da requisição
  const { page = 0, perPage = 5, ...query } = req.query;

  // Obter as despesas do político conforme os parâmetros e a página
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

exports.getChartsData = async function(req, res, next) {
  
  // Obter parâmetros da requisição
  const { politicianId } = req.query;

  // Obter as despesas do político conforme os parâmetros
  const expenses = await Expense.find({ politicianId: politicianId });
  
  // Obter os dados dos gráficos
  const [ expensesByMonth, expensesByType, expensesByTopNProviders ] =
  await Promise.all([
    totalizeExpensesByMonth(expenses),
    totalizeExpensesByType(expenses),
    totalizeExpensesByTopNProviders(expenses)
  ]);
  
  return res.send({
    expensesByMonth, expensesByType, expensesByTopNProviders });
}