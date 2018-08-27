const fastXmlParser = require('fast-xml-parser');
const Papa = require('papaparse');
const { toTitleCase, montarEndereco, removeAccents } = require('../utils/utils');

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
 * Obtém da resposta da função getDeputadosLista uma lista de ids de deputados
 * que será utilizida em outras requisições à API da Câmara.
 * @param {[Object]} deputadosLista Array de respostas em JSON proveniente da
 * função getDeputadosLista.
 */
async function getDeputadosIds(deputadosLista) {
  return [].concat(
    ...deputadosLista.map(resp => resp.dados.map(dep => dep.id))
  );
}

/**
 * Obtém da resposta da função getSenadoresLegislatura uma lista de códigos de
 * senadores que será utilizada em outras requisições à API do Senado.
 * @param {Object} senadoresLegislatura JSON de resposta da função 
 * getSenadoresLegislatura.
 */
async function getSenadoresCodigos(senadoresLegislatura) {
  const senadoresLista = 
  senadoresLegislatura.ListaParlamentarLegislatura.Parlamentares.Parlamentar;

  return senadoresLista.map(sen =>
    sen.IdentificacaoParlamentar.CodigoParlamentar
  );
}

/**
 * Gera uma lista de objetos Politico a partir das informações de deputados.
 * Extrai da resposta da função getTodosDeputados uma lista de políticos que
 * será inserida/atualizada no BD.
 * @param {[Object]} deputados JSON de resposta da função 
 * getTodosDeputados.
 */
async function gerarPoliticosDeDeputados(deputados) {
  return deputados.map(dep => dep.dados).map(d => ({
    codigo                : d.ultimoStatus.id.toString(),
    nome                  : toTitleCase(removeAccents(d.ultimoStatus.nome)),
    urlFoto               : d.ultimoStatus.urlFoto,
    siglaPartido          : d.ultimoStatus.siglaPartido,
    siglaUf               : d.ultimoStatus.siglaUf,
    descricaoStatus       : d.ultimoStatus.condicaoEleitoral,
    endereco              : montarEndereco(d.ultimoStatus.gabinete),
    email                 : d.ultimoStatus.gabinete.email.toLowerCase(),
    telefone              : d.ultimoStatus.gabinete.telefone,
    nomeCivil             : toTitleCase(d.nomeCivil),
    sexo                  : d.sexo,
    dataNascimento        : d.dataNascimento,
    siglaUfNascimento     : d.ufNascimento,
    cargo                 : 'Deputado Federal'
  }));
}

/**
 * Gera uma lista de objetos Politico a partir das informações de senadores.
 * Extrai da resposta da função getDetalhesTodosSenadores uma lista de 
 * políticos que será inserida/atualizada no BD.
 * @param {[Object]} senadores JSON de resposta da função 
 * getDetalhesTodosSenadores.
 */
async function gerarPoliticosDeSenadores(senadores) {
  return senadores.map(sen => sen.DetalheParlamentar.Parlamentar).map(s => {
    const mandato = s.MandatoAtual || s.UltimoMandato;
    const situacao = s.MandatoAtual ? 'Em Exercício' : 'Afastado';
    const dados = s.DadosBasicosParlamentar;
    const nome = toTitleCase(
      removeAccents(s.IdentificacaoParlamentar.NomeParlamentar));

    return {
      codigo            : s.IdentificacaoParlamentar.CodigoParlamentar,
      nome              : nome,
      urlFoto           : s.IdentificacaoParlamentar.UrlFotoParlamentar,
      siglaPartido      : s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
      siglaUf           : s.IdentificacaoParlamentar.UfParlamentar,
      descricaoStatus   : mandato.DescricaoParticipacao,
      endereco          : dados && dados.EnderecoParlamentar,
      email             : s.IdentificacaoParlamentar.EmailParlamentar,
      telefone          : dados && dados.TelefoneParlamentar,
      nomeCivil         : s.IdentificacaoParlamentar.NomeCompletoParlamentar,
      sexo              : s.IdentificacaoParlamentar.SexoParlamentar[0],
      dataNascimento    : dados && dados.DataNascimento,
      siglaUfNascimento : dados && dados.UfNaturalidade,
      cargo             : 'Senador',
      situacao          : situacao
    }
  });
}

/**
 * Converte um arquivo csv para json.
 * @param {String} csvString String em formato csv.
 */
async function converterCsvParaJson(csvString) {
  return Papa.parse(csvString, { header: true, skipEmptyLines: true });
}

/**
 * Transforma o arquivo csv de despesas dos senadores em um objeto json.
 * @param {String} despesasCsv Arquivo csv de despesas resultante da função
 * getDespesasSenadoresCsv.
 */
async function parsearDespesasSenadores(despesasCsv) {
  // Remover falso cabeçalho
  const desp = despesasCsv.slice(despesasCsv.indexOf('\n')+1);

  // Converter csv para json
  return await converterCsvParaJson(desp);
}

/**
 * Calcula o total de despesas de cada senador de acordo com o arquivo csv
 * transformado em json.
 * @param {Object} despesas Objeto resultante da função 
 * parsearDespesasSenadores.
 */
async function totalizarDespesasSenadores(despesas) {
  const senadores = Object.values(despesas.data.reduce((senador, sen) => {
    // Corrigir inconsistência entre resposta da API e conteúdo do CSV
    if(sen['SENADOR'] === 'PEDRO CHAVES DOS SANTOS FILHO') {
      sen['SENADOR'] = 'PEDRO CHAVES';
    }

    // Criar um objeto pra cada senador com nome e total de despesas
    const s = senador[sen['SENADOR']] || {
      nome: sen['SENADOR'],
      total: 0.00
    }

    // Obter o valor da despesa e formatá-lo
    valor = sen['VALOR_REEMBOLSADO'] &&
    parseFloat(sen['VALOR_REEMBOLSADO'].replace(',','.')).toFixed(2);

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

/**
 * Agrupa as despesas de cada deputado, junto com seu código.
 * @param {[Object]} depDespesas Array de objetos com as despesas dos deputados
 * resultante da função getTodasDespesasTodosDeputados.
 */
async function parsearDespesasDeputados(depDespesas) {
  return depDespesas.map(d => ({
    codigo: d.id,
    despesas: [].concat(...d.despesas.map(des => des.dados))
  }));
}

/**
 * Calcula o total de despesas de cada deputados.
 * @param {[Object]} despesas Array de objetos resultante da função
 * parsearDespesasDeputados.
 */
async function totalizarDespesasDeputados(despesas) {
  return despesas.map(d => {
    return {
    codigo: d.codigo,
    totalDespesas: d.despesas.reduce((total, d) => total + d['valorDocumento'], 0.00).toFixed(2)
  }})
}

async function getDeputadosMatriculas(obterDeputadosV1) {
  // Converter de xml pra json
  const deputados = await converterXmlParaJson(obterDeputadosV1);

  // Obter o número de matrícula de cada deputado
  const matriculas = deputados.deputados.deputado.map(d => ({
    matricula: d.matricula, codigo: d.ideCadastro, nome: d.nome
  }));

  return matriculas;
}

async function parsearFrequencia(req) {
  
  const reqJson = await converterXmlParaJson(req);
  
  const mat = reqJson.parlamentar.carteiraParlamentar;

  const dias = reqJson.parlamentar.diasDeSessoes2.dia;
  
  return {
    matricula: mat,
    frequency: {
      total: dias.length,
      presence: dias.filter(d => d.frequencianoDia.includes('Presença')).length,
      justifiedAbsence: dias.filter(d => 
        d.frequencianoDia.includes('Ausência justificada')).length,
      unjustifiedAbsence: dias.filter(d => 
        d.frequencianoDia.endsWith('Ausência')).length
    }
  }
}

module.exports = {
  converterXmlParaJson,
  validarXml,
  getDeputadosIds,
  getSenadoresCodigos,
  gerarPoliticosDeDeputados,
  gerarPoliticosDeSenadores,
  converterCsvParaJson,
  totalizarDespesasSenadores,
  parsearDespesasDeputados,
  totalizarDespesasDeputados,
  parsearDespesasSenadores,
  getDeputadosMatriculas,
  parsearFrequencia
}