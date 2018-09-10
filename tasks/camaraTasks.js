const Politico = require('../models/PoliticoModel');
const {
  getDeputadosListV2, getDeputadoDetail, getDeputadoExpenses,
  getDeputadosListV1, getDeputadoFrequency
} = require('../services/camara/camaraColector');
const {
  getDeputadosIds, createPoliticiansFromDeputados, parseDeputadosExpenses,
  getDeputadosTotalExpenditure, getDeputadosRegistration, parseFrequency,
  createDeputadosExpenses
} = require('../services/camara/camaraParser');
const {
  updatePoliticiansByCode, updatePoliticiansByName, updatePoliticianExpenses
} = require('../services/updaterService');
const { parallelPromises } = require('../utils/utils');

async function updateDeputadosTask() {
  try {
    // Obter lista de deputados
    console.log('Obtendo lista de deputados...');
    const deputadosList = await getDeputadosListV2();

    // Extrair ids da lista
    console.log('Extraindo ids da lista...');
    const deputadosIds = await getDeputadosIds(deputadosList);

    // Obter detalhes dos deputados com os ids
    console.log(`Obtendo detalhes de ${ deputadosIds.length } deputados...`);
    const deputados = await parallelPromises(getDeputadoDetail, deputadosIds);

    // Criar objetos políticos com detalhes dos deputados
    console.log('Gerando políticos de deputados...');
    const politicians = await createPoliticiansFromDeputados(deputados);

    // Atualizar os deputados no BD
    console.log('Atualizando deputados...');
    const count = await updatePoliticiansByCode(politicians);
    console.log(`${ count } deputados atualizados. FIM`); 
  } catch (error) {
    console.log(error);
  }
}

async function updateDeputadosTotalExpenditureTask() {
  try {
    // Obter códigos dos deputados
    const codDeputados = (await Politico.
      find({ cargo: 'Deputado Federal' }, '-_id codigo')).map(dep => dep.codigo);

    // Obter despesas dos deputados
    console.log('Obtendo despesas de deputados...');
    const expensesRes = await parallelPromises(getDeputadoExpenses, codDeputados);

    // Parsear despesas
    console.log('Parsear despesas de deputados...');
    const expenses = await parseDeputadosExpenses(expensesRes);

    // Totalizar despesas
    console.log('Totalizar despesas de deputados...');
    const totalExpenditure = await getDeputadosTotalExpenditure(expenses);

    // Atualizar o total de despesas dos deputados no BD
    console.log('Atualizando despesas de deputados...');
    const count = await updatePoliticiansByCode(totalExpenditure);
    console.log(`${ count } totais de despesas de deputados atualizadas. FIM`);
  } catch (error) {
    console.log(error);
  }
  
}

async function updateDeputadosFrequency() {
  try {
    // Obter os deputados
    console.log('Obtendo deputados da V1...');
    const deputadosV1 = await getDeputadosListV1();

    // Extrair as matrículas
    console.log('Extraindo matrículas...');
    const deps = await getDeputadosRegistration(deputadosV1);
    const regs = deps.map(d => d.matricula);

    // Obter listas de presença
    console.log('Obtendo listas de presença...');
    const presList = await parallelPromises(getDeputadoFrequency, regs);

    // Extrair as frequências
    console.log('Extraindo frequências...');
    const freqs = await parallelPromises(parseFrequency, presList);

    // Substituir matricula por código
    const polits = freqs.map(f => ({
      codigo: deps.find(d => d.matricula === f.matricula).codigo,
      frequency: f.frequency
    }));

    // Atualizar o BD
    console.log('Atualizando BD...');
    const count = await updatePoliticiansByCode(polits);
    console.log(`${ count } frequências de deputados atualizadas. FIM`);
  } catch (error) {
    console.log(error);
  }
  
}

async function updateDeputadosExpensesTask(amount=undefined) {
  // Obter os códigos de todos os deputados
  console.log('Obtendo os códigos dos deputados...');
  const codes = (await Politico.
    find({ cargo: 'Deputado Federal' }, '-_id codigo')).map(dep => dep.codigo).slice(0, amount);

  // Obter as despesas de todos os deputados usando a API
  console.log(`Obtendo as despesas de ${ codes.length } deputados...`);
  const expensesAPI = await parallelPromises(getDeputadoExpenses, codes);

  // Parsear as despesas
  console.log('Parseando as despesas dos deputados...');
  const expenses = await parseDeputadosExpenses(expensesAPI);

  // Criar objetos despesas para inserir no BD
  console.log('Criando as despesas que serão inseridas no BD...');
  const expensesObj = await createDeputadosExpenses(expenses);

  // Atualizar a coleção de despesas
  console.log(`Atualizando a coleção com ${ expensesObj.length } despesas...`);
  const count = await updatePoliticianExpenses(expensesObj);

  console.log(`${ count } novas despesas inseridas.`);
  return count;
}

module.exports = {
  updateDeputadosTask,
  updateDeputadosTotalExpenditureTask,
  updateDeputadosFrequency,
  updateDeputadosExpensesTask,
}
