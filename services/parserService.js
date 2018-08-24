const fastXmlParser = require('fast-xml-parser');
const { toTitleCase, montarEndereco } = require('../utils/utils');

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
  try {
    return await validarXml(dadosXml) && fastXmlParser.parse(dadosXml);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtém da resposta da função getDeputadosLista uma lista de ids de deputados
 * que será utilizida em outras requisições à API da Câmara.
 * @param {[Object]} deputadosLista Array de respostas em JSON proveniente da
 * função getDeputadosLista.
 */
async function getDeputadosIds(deputadosLista) {
  return [].concat(
    ...deputadosLista.map(resp => resp.dados.map(dep => dep.id)));
}

/**
 * Obtém da resposta da função getSenadoresEmExercicio uma lista de códigos de
 * senadores que será utilizada em outras requisições à API do Senado.
 * @param {Object} senadoresEmExercicio JSON de resposta da função 
 * getSenadoresEmExercicio.
 */
async function getSenadoresCodigos(senadoresEmExercicio) {
  const senadoresLista = 
  senadoresEmExercicio.ListaParlamentarEmExercicio.Parlamentares.Parlamentar;

  return senadoresLista.map(sen =>
    sen.IdentificacaoParlamentar.CodigoParlamentar);
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
    nome                  : toTitleCase(d.ultimoStatus.nome),
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
  return senadores.map(sen => sen.DetalheParlamentar.Parlamentar).map(s => ({
    codigo            : s.IdentificacaoParlamentar.CodigoParlamentar,
    nome              : s.IdentificacaoParlamentar.NomeParlamentar,
    urlFoto           : s.IdentificacaoParlamentar.UrlFotoParlamentar,
    siglaPartido      : s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
    siglaUf           : s.IdentificacaoParlamentar.UfParlamentar,
    descricaoStatus   : s.MandatoAtual.DescricaoParticipacao,
    endereco          : s.DadosBasicosParlamentar.EnderecoParlamentar,
    email             : s.IdentificacaoParlamentar.EmailParlamentar,
    telefone          : s.DadosBasicosParlamentar.TelefoneParlamentar,
    nomeCivil         : s.IdentificacaoParlamentar.NomeCompletoParlamentar,
    sexo              : s.IdentificacaoParlamentar.SexoParlamentar[0],
    dataNascimento    : s.DadosBasicosParlamentar.DataNascimento,
    siglaUfNascimento : s.DadosBasicosParlamentar.UfNaturalidade,
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
  getDeputadosMatriculas
}