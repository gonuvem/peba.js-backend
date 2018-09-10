const {
  getSenadoresList, getSenadorDetail, getSenadoresExpensesCsv
} = require('../services/senado/senadoColector');
const {
  getSenadoresIds, createPoliticiansFromSenadores,
  getSenadoresTotalExpenditure, parseSenadoresExpenses
} = require('../services/senado/senadoParser');
const {
  updatePoliticiansByCode, updatePoliticiansByName
} = require('../services/updaterService');
const { parallelPromises } = require('../utils/utils');

async function updateSenadoresTask() {
  try {
    // Obter lista de senadores
    console.log('Obtendo lista de senadores...');
    const senadoresList = await getSenadoresList();

    // Extrair ids da lista
    console.log('Extraindo ids da lista...');
    const senadoresIds = await getSenadoresIds(senadoresList);

    // Obter detalhes dos senadores com os ids
    console.log(`Obtendo detalhes de ${ senadoresIds.length } senadores...`);
    const senadores = await parallelPromises(getSenadorDetail, senadoresIds);

    // Criar objetos políticos com detalhes dos senadores
    console.log('Gerando políticos de senadores...');
    const politicians = await createPoliticiansFromSenadores(senadores);

    // Atualizar os senadores no BD
    console.log('Atualizando senadores...');
    const count = await updatePoliticiansByCode(politicians);
    console.log(`${ count } senadores atualizados. FIM`);
  } catch (error) {
    console.log(error);
  }
  
}

async function updateSenadoresTotalExpenditureTask() {
  try {
    // Obter despesas dos senadores
    console.log('Obtendo despesas de senadores...')
    const expensesCsv = await getSenadoresExpensesCsv();

    // Parsear despesas
    console.log('Parsear despesas de senadores...')
    const expenses = await parseSenadoresExpenses(expensesCsv);

    // Totalizar despesas
    console.log('Totalizar despesas de senadores...')
    const totalExpenditure = await getSenadoresTotalExpenditure(expenses);

    // Atualizar o total de despesas dos senadores no BD
    console.log('Atualizando despesas de senadores...')
    const count = await updatePoliticiansByName(totalExpenditure);
    console.log(`${ count } totais de despesas de senadores atualizadas. FIM`); 
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  updateSenadoresTask,
  updateSenadoresTotalExpenditureTask,
}
