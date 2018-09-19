const {
  getSenadoresList, getSenadorDetail, getSenadoresExpensesCsv,
  getSenadoresEmExercicio, getSenadoresAfastados
} = require('../services/senado/senadoColector');
const {
  getSenadoresIds, createPoliticiansFromSenadores, createSenadoresExpenses,
  getSenadoresTotalExpenditure, parseSenadoresExpenses, getSenadoresDescricaoStatus,
  getSenadoresSituacao, getSenadoresSuplencia
} = require('../services/senado/senadoParser');
const {
  updatePoliticiansByCode, updatePoliticiansByName, updatePoliticianExpenses
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

async function updateSenadoresExpensesTask(amount=undefined) {

  // Obter as despesas de todos os senadores
  console.log('Obtendo despesas de senadores...')
  const expensesCsv = await getSenadoresExpensesCsv();

  // Parsear despesas
  console.log('Parsear despesas de senadores...')
  const expenses = await parseSenadoresExpenses(expensesCsv);

  // Criar objetos despesas para inserir no BD
  console.log('Criando as despesas que serão inseridas no BD...');
  const expensesObj = await createSenadoresExpenses(expenses); 
  
  // Atualizar a coleção de despesas
  console.log(`Atualizando a coleção com ${ expensesObj.length } despesas...`);
  const count = await updatePoliticianExpenses(expensesObj.slice(0, amount));

  console.log(`${ count } novas despesas inseridas.`);

  return count;
}

async function updateSenadoresStatusTask() {
  // Obter todos os senadores da Legislatura
  console.log('Obtendo os senadores da legislatura...');
  const senadoresLegis = await getSenadoresList();

  // Obter os senadores em exercício
  console.log('Obtendo os senadores em exercício...');
  const senadoresExer = await getSenadoresEmExercicio();

  // Obter os senadores afastados
  console.log('Obtendo os senadores afastados...');
  const senadoresAfas = await getSenadoresAfastados();

  /* Obter o campo descricaoStatus de todos os senadores
  Obter o campo situacao dos senadores em exercício e afastados
  */
  console.log('Obtendo a descricaoStatus de todos os senadores e o campo \
  situação daqueles em exercício e afastados');
  const [ senadoresDesc, senExer, senAfas ] = await Promise.all([
    getSenadoresDescricaoStatus(senadoresLegis),
    getSenadoresSituacao(senadoresExer, 'Exercício'),
    getSenadoresSituacao(senadoresAfas, 'Afastado'),
  ]);

  // Os senadores remanescentes são considerados em situação de Suplência
  console.log('Obtendo situacao de Suplência para senadores restantes...');
  const senSupl = await getSenadoresSuplencia(senadoresDesc, senExer, senAfas);

  // Concatenar os objetos que contém situação
  console.log('Concatenando todas as situações...');
  const senSituacao = senExer.concat(senAfas, senSupl);

  /* Combinar as objetos que contêm a descricaoStatus com aqueles que contêm
  a situacao dos senadores, considerando o código do senador
  */
  console.log('Combinando descricaoStatus com situacao...');
  const senadoresStatus = senadoresDesc.map(sDesc => 
    Object.assign(sDesc, 
      senSituacao.find(sSit => sSit.codigo === sDesc.codigo)));

  // Atualizar o status de cada senador no BD
  console.log('Atualizando o status de cada senador no BD...')
  const count = await updatePoliticiansByCode(senadoresStatus);

  console.log(`${ count } status de senadores atualizados.`);
  return count;
}

module.exports = {
  updateSenadoresTask,
  updateSenadoresTotalExpenditureTask,
  updateSenadoresExpensesTask,
  updateSenadoresStatusTask,
}
