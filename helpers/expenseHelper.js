const { resolve } = require('../utils/utils');

async function totalizeExpensesByField(expenses, field) {
  return Object.values(expenses.reduce((totalsByFields, e) => {
    const filter = resolve(field.filter, e);
    const totalByField = totalsByFields[filter] || {
      [field.name]: e[field.name],
      total: 0.00
    }

    const value = parseFloat(e.value);
    totalByField.total += value;

    totalsByFields[filter] = totalByField;
    return totalsByFields;
  }, {}));
}

function roundExpensesTotal(expenses) {
  return expenses.map(e => ({ ...e, total: e.total.toFixed(2) }));
}

async function totalizeExpensesByMonth(expenses) {

  // Fazer o somatório por mês da despesa
  const expensesTotals = await totalizeExpensesByField(
    expenses, { name: 'month', filter: 'month'});
  
  // Ordenar do menor mês para o maior (1 -> 12)
  const expensesSorted = expensesTotals.sort((a,b) => a.month - b.month);

  // Arredondar o valor para duas casas
  const expensesByMonth = roundExpensesTotal(expensesSorted);
  
  return expensesByMonth;
}

async function totalizeExpensesByType(expenses) {

  // Fazer o somatório por tipo de despesa
  const expensesTotals = await totalizeExpensesByField(
    expenses, { name: 'type', filter: 'type' });
  
  // Arredondar o valor para duas casas
  const expensesByType = roundExpensesTotal(expensesTotals);
  
  return expensesByType;
}

async function totalizeExpensesByTopNProviders(expenses, n = 10) {

  // Fazer o somatório por fornecedor da despesa
  const expensesTotals = await totalizeExpensesByField
  (expenses, { name: 'provider', filter: 'provider.cnpjCpf'});

  // Ordenar do maior valor para o menor e selecionar apenas os n primeiros
  const expensesSorted = expensesTotals
  .sort((a,b) => b.total - a.total).slice(0, n);

  // Arredondar o valor para duas casas
  const expensesByTopNProviders = roundExpensesTotal(expensesSorted);
  
  return expensesByTopNProviders;
}

module.exports = {
  totalizeExpensesByField,
  totalizeExpensesByMonth,
  totalizeExpensesByType,
  totalizeExpensesByTopNProviders,
}