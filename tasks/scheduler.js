const CronJob = require('cron').CronJob;
const timezone = 'America/Fortaleza';
const {
  updateDeputadosTask, updateDeputadosTotalExpenditureTask,
  updateDeputadosFrequency, updateDeputadosExpensesTask
} = require('./camaraTasks');
const {
  updateSenadoresTask, updateSenadoresTotalExpenditureTask,
  updateSenadoresExpensesTask
} = require('./senadoTasks');

/**
 * Cria um cron job que atualiza os políticos e seus totais de despesas.
 * O cron job executa toda segunda-feira (1 no cronTime) às
 * 2h da manhã (0 0 2 no cronTime), considerando a hora do fuso horário 
 * America/Fortaleza.
 */
function updatePoliticiansJob() {
  return new CronJob({
    cronTime: '0 0 2 * * 1',
    onTick: updateTask(),
    timeZone: timezone,
    start: false,
    runOnInit: false,
  });
}
/*
const updatePoliticiansJob = new CronJob({
  cronTime: '00 00 02 * * 1',
  onTick: updateTask(),
  timeZone: timezone
});
*/

async function updateTask() {
  try {
    console.log('INICIANDO TAREFAS...');
    console.log('Atualizar políticos...');
    await updatePoliticiansTask();
    console.log('Atualizar as despesas dos políticos...');
    await updateExpensesTask();
    console.log('Atualizar frequência dos políticos...');
    await updatePoliticiansFrequencyTask();
    console.log('Atualizar total de despesas...');
    await updateTotalExpenditureTask();
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function updatePoliticiansTask() {
  try {
    await updateDeputadosTask();
    await updateSenadoresTask();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateTotalExpenditureTask() {
  try {
    await updateDeputadosTotalExpenditureTask();
    await updateSenadoresTotalExpenditureTask();
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
  updatePoliticiansJob,
  updateExpensesTask,
}