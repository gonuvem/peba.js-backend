const Politico = require('../models/PoliticoModel');
const Expense = require('../models/ExpenseModel');
const {
  updateDeputadosTask, updateDeputadosTotalExpenditureTask,
  updateDeputadosFrequency, updateDeputadosExpensesTask
} = require('./camaraTasks');
const {
  updateSenadoresTask, updateSenadoresTotalExpenditureTask,
  updateSenadoresExpensesTask, updateSenadoresStatusTask,
} = require('./senadoTasks');
const { updatePoliticiansByCode } = require('../services/updaterService');

async function updateTask() {
  try {
    console.log('INICIANDO TAREFAS...');
    console.log('Atualizar políticos...');
    await updatePoliticiansTask();
    console.log('Atualizar as despesas dos políticos...');
    await updateExpensesTask();
    console.log('Atualizar total de despesas...');
    await updateTotalExpenditureTask();
    console.log('Atualizar frequência dos políticos...');
    await updatePoliticiansFrequencyTask();
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function updatePoliticiansTask() {
  try {
    await updateDeputadosTask();
    await updateSenadoresTask();
    await updateSenadoresStatusTask();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateTotalExpenditureTask() {
  try {
    // Obter todos os políticos do BD
    const politicians = await Politico.find({});

    // Totalizar despesas
    console.log('Totalizar despesas de deputados...');
    let totalExpenditure = [];

    for (const pol of politicians) {
      // Obter as despesas do político
      const expenses = await Expense.find({ politicianId: pol._id }, 'value');
      
      // Totalizar as despesas
      totalExpenditure.push({
        codigo: pol.codigo,
        totalDespesas: expenses.reduce((total, e) => 
        total + parseFloat(e.value), 0.00).toFixed(2) || '0.00',
        atualizacao: new Date()
      });
    }
    
    // Atualizar o total de despesas dos políticos no BD
    console.log('Atualizando despesas de políticos...');
    const count = await updatePoliticiansByCode(totalExpenditure);
    console.log(`${ count } totais de despesas de políticos atualizadas. FIM`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updatePoliticiansFrequencyTask() {
  try {
    await updateDeputadosFrequency(); 
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateExpensesTask(amount=undefined) {
  try {
    const deputadosExp = await updateDeputadosExpensesTask(amount);
    const senadoresExp = await updateSenadoresExpensesTask(amount);
    return deputadosExp + senadoresExp;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  updateTask,
  updatePoliticiansTask,
  updateTotalExpenditureTask,
  updatePoliticiansFrequencyTask,
  updateExpensesTask,
}