const fastXmlParser = require('fast-xml-parser');
const {
  toTitleCase, montarEndereco, removeAccents
} = require('../../utils/utils');
const { getPoliticoMapCodeId } = require('../../helpers/politicianHelper');

/**
 * Validar um arquivo xml.
 * @param {String} dadosXml String no formato de um arquivo XML
 */
function validarXml(dadosXml) {
  return new Promise((resolve, reject) => {
    const isXml = dadosXml && fastXmlParser.validate(dadosXml);
    isXml ? resolve(isXml) : reject(new Error('Não é um arquivo XML'));
  });
}

/**
 * Converte uma string em xml para um objeto json.
 * @param {String} dadosXml 
 */
async function converterXmlParaJson(dadosXml) {
  return await validarXml(dadosXml) && fastXmlParser.parse(dadosXml);
}

/**
 * Obtém da resposta da função getDeputadosListV2 uma lista de ids de deputados
 * que será utilizada em outras requisições à API da Câmara.
 * @param {[Object]} deputados Array de respostas em JSON proveniente da
 * função getDeputadosListV2.
 */
async function getDeputadosIds(deputados) {
  return [].concat(
    ...deputados.map(resp => resp.dados.map(dep => dep.id))
  );
}

/**
 * Gera uma lista de objetos Politico a partir das informações de deputados.
 * Extrai de um array de respostas da função getDeputadoDetail uma lista de 
 * políticos que será inserida/atualizada no BD.
 * @param {[Object]} deputados Array com JSONs de resposta da função 
 * getDeputadoDetail.
 */
async function createPoliticiansFromDeputados(deputados) {
  return deputados.map(dep => dep.dados).map(d => ({
    codigo: d.ultimoStatus.id.toString(),
    nome: toTitleCase(removeAccents(d.ultimoStatus.nome)),
    urlFoto: d.ultimoStatus.urlFoto,
    siglaPartido: d.ultimoStatus.siglaPartido,
    siglaUf: d.ultimoStatus.siglaUf,
    descricaoStatus: d.ultimoStatus.condicaoEleitoral,
    endereco: montarEndereco(d.ultimoStatus.gabinete),
    email: d.ultimoStatus.gabinete.email.toLowerCase(),
    telefone: d.ultimoStatus.gabinete.telefone,
    nomeCivil: toTitleCase(d.nomeCivil),
    sexo: d.sexo,
    dataNascimento: d.dataNascimento,
    siglaUfNascimento: d.ufNascimento,
    situacao: d.ultimoStatus.situacao,
    cargo: 'Deputado Federal',
    totalDespesas: "0.00",
    frequency: null
  }));
}

/**
 * Agrupa as despesas de cada deputado, junto com seu código.
 * @param {[Object]} depDespesas Array de objetos com as despesas dos deputados
 * resultante de chamadas da função getDeputadoExpenses.
 */
async function parseDeputadosExpenses(depExpenses) {
  return depExpenses.map(d => ({
    codigo: d.id,
    despesas: [].concat(...d.expenses.map(des => des.dados))
  }));
}

/**
 * Calcula o total de despesas de cada deputados.
 * @param {[Object]} expenses Array de objetos resultante da função
 * parseDeputadosExpenses.
 */
async function getDeputadosTotalExpenditure(expenses) {
  return expenses.map(d => {
    return {
      codigo: d.codigo,
      totalDespesas: d.despesas
      .reduce((total, d) => total + d['valorDocumento'], 0.00).toFixed(2)
    }
  })
}

/**
 * Obtém a matrícula de cada deputado para que seja possível a consulta na
 * lista de presenças da API V1.
 * @param {String} deputadosListV1 Retorno da função getDeputadosListV1 no
 * formato xml.
 */
async function getDeputadosRegistration(deputadosListV1) {
  // Converter de xml pra json
  const deputados = await converterXmlParaJson(deputadosListV1);

  // Obter o número de matrícula de cada deputado
  const registrations = deputados.deputados.deputado.map(d => ({
    matricula: d.matricula, codigo: d.ideCadastro, nome: d.nome
  }));

  return registrations;
}

/**
 * Extrai da lista de presenças de um parlamentar a sua frequência.
 * A frequência pode ser dividida em: total de dias, dias com presença,
 * dias com ausência justificada e com ausência não justificada.
 * @param {String} deputadoFrequency Retorno da função getDeputadoFrequency
 * em formato Xml.
 */
async function parseFrequency(deputadoFrequency) {
  // Converte de Xml para Json
  const frequencyJson = await converterXmlParaJson(deputadoFrequency);

  // Extrai a matrícula do deputado
  const registration = frequencyJson.parlamentar.carteiraParlamentar;

  // Extrai o array de dias com sessões
  const days = frequencyJson.parlamentar.diasDeSessoes2.dia;

  // Extrai a frequência do deputado
  const frequency = days.map(d => d.frequencianoDia).reduce((fAcc, fDay) => ({
    total: fAcc.total + 1,
    presence: fAcc.presence + (fDay.includes('Presença') ? 1 : 0),
    justifiedAbsence: fAcc.justifiedAbsence 
    + (fDay.includes('Ausência justificada') ? 1 : 0),
    unjustifiedAbsence: fAcc.unjustifiedAbsence 
    + (fDay.endsWith('Ausência') ? 1 : 0)
  }), { total: 0, presence: 0, justifiedAbsence: 0, unjustifiedAbsence: 0 });
  

  return { matricula: registration, frequency: frequency }
}

async function createDeputadosExpenses(depExpenses) {

  const mapCodeId = await getPoliticoMapCodeId('Deputado Federal');
  
  const expensesByDep = depExpenses.map(dep => {
    const politicianId = mapCodeId[dep.codigo];
    return dep.despesas.map(e => ({
      politicianId: politicianId,
      year: e.ano,
      month: e.mes,
      type: e.tipoDespesa,
      provider: {
        cnpjCpf: e.cnpjCpfFornecedor,
        name: e.nomeFornecedor
      },
      code: Object.values(e).join('_'),
      numDoc: e.numDocumento,
      date: new Date(e.dataDocumento),
      value: e.valorDocumento.toFixed(2)
    }));
  });

  return [].concat(...expensesByDep);
}

module.exports = {
  getDeputadosIds,
  createPoliticiansFromDeputados,
  parseDeputadosExpenses,
  getDeputadosTotalExpenditure,
  getDeputadosRegistration,
  parseFrequency,
  createDeputadosExpenses,
}
