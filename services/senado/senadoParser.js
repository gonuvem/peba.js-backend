const Papa = require('papaparse');
const moment = require('moment');
const {
  toTitleCase, removeAccents
} = require('../../utils/utils');
const { getPoliticoMapNameId } = require('../../helpers/politicianHelper');

/**
 * Converte um arquivo csv para json.
 * @param {String} csvString String em formato csv.
 */
async function converterCsvParaJson(csvString) {
  return Papa.parse(csvString, { header: true, skipEmptyLines: true });
}

/**
 * Obtém da resposta da função getSenadoresList uma lista de códigos de
 * senadores que será utilizada em outras requisições à API do Senado.
 * @param {Object} senadoresList JSON de resposta da função 
 * getSenadoresList.
 */
async function getSenadoresIds(senadoresList) {
  const senadores =
    (senadoresList.ListaParlamentarLegislatura
    || senadoresList.ListaParlamentarEmExercicio
    || senadoresList.AfastamentoAtual).Parlamentares.Parlamentar;

  return senadores.map(sen =>
    sen.IdentificacaoParlamentar.CodigoParlamentar
  );
}

/**
 * Gera uma lista de objetos Politico a partir das informações de senadores.
 * Extrai de um array de respostas da função getSenadorDetail uma lista de 
 * políticos que será inserida/atualizada no BD.
 * @param {[Object]} senadores Array com JSON de respostas da função 
 * getSenadorDetail.
 */
async function createPoliticiansFromSenadores(senadores) {
  return senadores.map(sen => sen.DetalheParlamentar.Parlamentar).map(s => {
    const dados = s.DadosBasicosParlamentar;
    const nome = toTitleCase(
      removeAccents(s.IdentificacaoParlamentar.NomeParlamentar));

    return {
      codigo: s.IdentificacaoParlamentar.CodigoParlamentar,
      nome: nome,
      urlFoto: s.IdentificacaoParlamentar.UrlFotoParlamentar,
      siglaPartido: s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
      siglaUf: s.IdentificacaoParlamentar.UfParlamentar,
      endereco: dados && dados.EnderecoParlamentar,
      email: s.IdentificacaoParlamentar.EmailParlamentar,
      telefone: dados && dados.TelefoneParlamentar,
      nomeCivil: s.IdentificacaoParlamentar.NomeCompletoParlamentar,
      sexo: s.IdentificacaoParlamentar.SexoParlamentar[0],
      dataNascimento: dados && dados.DataNascimento,
      siglaUfNascimento: dados && dados.UfNaturalidade,
      cargo: 'Senador',
      frequency: null
    }
  });
}

/**
 * Transforma o arquivo csv de despesas dos senadores em um objeto json.
 * @param {String} expensesCsv Arquivo csv de despesas resultante da função
 * getSenadoresExpensesCsv.
 */
async function parseSenadoresExpenses(expensesCsv) {
  // Remover falso cabeçalho
  const expenses = expensesCsv.slice(expensesCsv.indexOf('\n') + 1);

  // Converter csv para json
  return await converterCsvParaJson(expenses);
}

/**
 * Calcula o total de despesas de cada senador de acordo com o arquivo csv
 * transformado em json.
 * @param {Object} expenses Objeto resultante da função 
 * parseSenadoresExpenses.
 */
async function getSenadoresTotalExpenditure(expenses) {
  const senadores = Object.values(expenses.data.reduce((senador, sen) => {
    // Corrigir inconsistência entre resposta da API e conteúdo do CSV
    if (sen['SENADOR'] === 'PEDRO CHAVES DOS SANTOS FILHO') {
      sen['SENADOR'] = 'PEDRO CHAVES';
    }

    // Criar um objeto pra cada senador com nome e total de despesas
    const s = senador[sen['SENADOR']] || {
      nome: sen['SENADOR'],
      total: 0.00
    }

    // Obter o valor da despesa e formatá-lo
    valor = sen['VALOR_REEMBOLSADO'] &&
      parseFloat(sen['VALOR_REEMBOLSADO'].replace(',', '.')).toFixed(2);

    // Somar o valor analisado com o total armazenado no senador correspondente
    s.total += valor && parseFloat(valor);
    senador[sen['SENADOR']] = s;

    return senador;
  }, {}))

  return senadores.map(s => ({
    // Formatar nome retirando acentos e colocando a primeira letra,
    // de cada palavra, maiúscula
    nome: toTitleCase(removeAccents(s.nome)),

    // Formatar total de despesas para duas casas decimais
    totalDespesas: (s.total.toFixed(2))
  }));
}

async function createSenadoresExpenses(expenses) {
  const mapNameId = await getPoliticoMapNameId('Senador');

  return expenses.data.map(e => {
    const value = parseFloat(e['VALOR_REEMBOLSADO'].replace(',', '.')).toFixed(2);
    const name = toTitleCase(removeAccents(e['SENADOR']));
    
    return {
    politicianId: mapNameId[name],
    year: e['ANO'],
    month: e['MES'],
    type: e['TIPO_DESPESA'],
    provider: {
      cnpjCpf: e['CNPJ_CPF'].replace(/\D/g, ''),
      name: e['FORNECEDOR']
    },
    code: Object.values(e).join('_'),
    numDoc: e['DOCUMENTO'],
    date: moment(e['DATA'], 'DD/MM/YYYY'),
    value: value
    }
  });
}

async function getSenadoresDescricaoStatus(senadoresList) {
  const senadores = senadoresList.ListaParlamentarLegislatura.Parlamentares.Parlamentar;
  return senadores.map(s => ({
    codigo: s.IdentificacaoParlamentar.CodigoParlamentar,
    descricaoStatus: s.Mandatos.Mandato.DescricaoParticipacao,
  }));
}

async function getSenadoresSituacao(senadoresList, situacao) {
  const senadores = (senadoresList.AfastamentoAtual 
    || senadoresList.ListaParlamentarEmExercicio).Parlamentares.Parlamentar;
    
    return senadores.map(sen => ({
      codigo: sen.IdentificacaoParlamentar.CodigoParlamentar,
      situacao: situacao,
    }));
}

async function getSenadoresSuplencia(senadoresList, exercicioList, afastadosList) {
  const codesSen = senadoresList.map(s => s.codigo);
  const codesExer = exercicioList.map(s => s.codigo);
  const codesAfas = afastadosList.map(s => s.codigo);
  return codesSen.filter(c => !codesExer.includes(c) && !codesAfas.includes(c))
  .map(cSup => ({
    codigo: cSup,
    situacao: 'Suplência'
  }));
}


module.exports = {
  getSenadoresIds,
  createPoliticiansFromSenadores,
  parseSenadoresExpenses,
  getSenadoresTotalExpenditure,
  createSenadoresExpenses,
  getSenadoresDescricaoStatus,
  getSenadoresSituacao,
  getSenadoresSuplencia,
}
