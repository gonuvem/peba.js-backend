const Politico = require('../models/PoliticoModel');
const Expense = require('../models/ExpenseModel');
const { splitArray } = require('../utils/utils');

/**
 * Cria, ou atualiza, as informações dos políticos de forma massiva.
 * Utiliza o nome do político como filtro.
 * @param {[Object]} politicians Array de Objeto JSON que contém as informações
 * dos politicos.
 */
async function updatePoliticiansByName(politicians) {
  try {
    const result = await Politico.bulkWrite(politicians.map(p => ({
      updateOne: { filter: { nome: p.nome }, update: p, upsert: true }
    })));
    return result.upsertedCount + result.modifiedCount;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

/**
 * Cria, ou atualiza, as informações dos políticos de forma massiva.
 * Utiliza o código do político como filtro.
 * @param {[Object]} politicians Array de Objeto JSON que contém as informações
 * dos politicos.
 */
async function updatePoliticiansByCode(politicians) {
  try {
    const result = await Politico.bulkWrite(politicians.map(p => ({
      updateOne: { filter: { codigo: p.codigo }, update: p, upsert: true }
    })));
    return result.upsertedCount + result.modifiedCount;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function updatePoliticianExpenses(expenses) {
  try {
    const batchSize = 3000;

    const expensesBulk = expenses.map(e => ({
      updateOne: { filter: { code: e.code }, update: e, upsert: true }
    }));

    console.log(`Dividindo as ${ expensesBulk.length } despesas em grupos de ${ batchSize }...`);
    const expensesSplited = await splitArray(expensesBulk, batchSize);

    let count = 0;
    for (const exp of expensesSplited) {
      console.log(`Inserindo grupo com ${ exp.length } despesas...`);
      const expensesResult = await Expense.bulkWrite(exp, { ordered: false });
      console.log('Exp mod ups ',expensesResult.modifiedCount, expensesResult.upsertedCount);
      count += expensesResult.modifiedCount + expensesResult.upsertedCount;
    }

    return count;
  } catch (error) {
    console.log(error)
    throw error;
  }
}


module.exports = {
  updatePoliticiansByName,
  updatePoliticiansByCode,
  updatePoliticianExpenses,
}