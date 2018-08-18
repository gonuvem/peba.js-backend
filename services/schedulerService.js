const CronJob = require('cron').CronJob;
const {
  getDeputadosLista, getTodosDeputados, getSenadoresLegislatura,
  getDetalhesTodosSenadores, getDespesasSenadoresCsv,
  getTodasDespesasTodosDeputados
} = require('./coletorService');
const {
  getDeputadosIds, gerarPoliticosDeDeputados, getSenadoresCodigos,
  gerarPoliticosDeSenadores, parsearDespesasSenadores, totalizarDespesasSenadores,
  parsearDespesasDeputados, totalizarDespesasDeputados
} = require('./parserService');
const {
  updatePoliticos, updateTotalDespesas, updateTotalDespesasDeputados
} = require('./updaterService');
const Politico = require('../models/PoliticoModel');

const timezone = 'America/Fortaleza';

/**
 * Cria um cron job que atualiza o status dos boletos gerados pelo 
 * generateTicketsJob. O cron job executa toda segunda-feira (1 no cronTime) às
 * 2h da manhã (00 00 02 no cronTime), considerando a hora do fuso horário 
 * America/Fortaleza.
 */
const updatePoliticosJob = new CronJob({
  cronTime: '00 00 02 * * 1',
  onTick: async function(){ 
    await atualizarPoliticos(),
    await atualizarTotalDespesas()
  },
  start: false,
  timeZone: timezone
});

async function atualizarPoliticos() {
  try {
    await atualizarDeputados();
    await atualizarSenadores();
  } catch (error) {
    console.log(error);
  }
}

async function atualizarTotalDespesas() {
  try {
    await atualizarTotalDespesasDeputados();
    await atualizarTotalDespesasSenadores();
  } catch (error) {
    console.log(error);
  }
}


async function atualizarDeputados() {
  // Obter lista de deputados
  console.log('Obtendo lista de deputados...');
  const deputadosLista = await getDeputadosLista();

  // Extrair ids da lista
  console.log('Extraindo ids da lista...');
  const deputadosIds = await getDeputadosIds(deputadosLista);

  // Obter detalhes dos deputados com os ids
  console.log(`Obtendo detalhes de ${deputadosIds.length} deputados...`);
  const deputados = await getTodosDeputados(deputadosIds.slice(0,3));

  // Criar objetos políticos com detalhes dos deputados
  console.log('Gerando políticos de deputados...');
  const depPoliticos = await gerarPoliticosDeDeputados(deputados);

  // Atualizar os deputados no BD
  console.log('Atualizando deputados...');
  const qtdDep = await updatePoliticos(depPoliticos);
  console.log(`${qtdDep} deputados atualizados. FIM`);
}

async function atualizarSenadores() {
  // Obter lista de senadores
  console.log('Obtendo lista de senadores...');
  const senadoresLista = await getSenadoresLegislatura();

  // Extrair ids da lista
  console.log('Extraindo ids da lista...');
  const senadoresCodigos = await getSenadoresCodigos(senadoresLista);

  // Obter detalhes dos senadores com os ids
  console.log(`Obtendo detalhes de ${senadoresCodigos.length} senadores...`);
  const senadores = await getDetalhesTodosSenadores(senadoresCodigos.slice(0,3));

  // Criar objetos políticos com detalhes dos senadores
  console.log('Gerando políticos de senadores...');
  const senPoliticos = await gerarPoliticosDeSenadores(senadores);

  // Atualizar os senadores no BD
  console.log('Atualizando senadores...');
  const qtdSen = await updatePoliticos(senPoliticos);
  console.log(`${qtdSen} senadores atualizados. FIM`);
}

async function atualizarTotalDespesasDeputados() {
  // Obter códigos dos deputados
  const codDeputados = (await Politico.
    find({ cargo: 'Deputado Federal' }, '-_id codigo')).map(dep => dep.codigo);

  // Obter despesas dos deputados
  console.log('Obtendo despesas de deputados...');
  const despesasReq = await getTodasDespesasTodosDeputados(codDeputados.slice(0,3));

  // Parsear despesas
  console.log('Parsear despesas de deputados...');
  const despesas = await parsearDespesasDeputados(despesasReq);

  // Totalizar despesas
  console.log('Totalizar despesas de deputados...');
  const totalDespesas = await totalizarDespesasDeputados(despesas);

  // Atualizar o total de despesas dos deputados no BD
  console.log('Atualizando despesas de deputados...');
  const qtdAtualizada = await updateTotalDespesasDeputados(totalDespesas);
  console.log(`${qtdAtualizada} totais de despesas de deputados atualizadas. FIM`);
}

async function atualizarTotalDespesasSenadores() {
  // Obter despesas dos senadores
  console.log('Obtendo despesas de senadores...')
  const despesasCsv = await getDespesasSenadoresCsv();

  // Parsear despesas
  console.log('Parsear despesas de senadores...')
  const despesas = await parsearDespesasSenadores(despesasCsv);

  // Totalizar despesas
  console.log('Totalizar despesas de senadores...')
  const total = await totalizarDespesasSenadores(despesas);

  // Atualizar o total de despesas dos senadores no BD
  console.log('Atualizando despesas de senadores...')
  const qtdAtualizada = await updateTotalDespesas(total);
  console.log(`${qtdAtualizada} totais de despesas de senadores atualizadas. FIM`);
}


module.exports = {
  atualizarPoliticos,
  atualizarTotalDespesas,
  updatePoliticosJob
}