const rp = require('request-promise-any');
const moment = require('moment');

const currentLegislature = 55;
const currentYear = 2018;
const initialPage = 1;
const limitPerPage = 100;
const legislatureStart = '01/02/2015';
const today = moment().locale('pt-br').format('L');

/**
 * URLs base da API V1 e V2 de Dados Abertos da Câmara dos Deputados.
 * Mais informações:
 * V1: http://www2.camara.leg.br/transparencia/dados-abertos/dados-abertos-legislativo'
 * V2: https://dadosabertos.camara.leg.br/swagger/api.html
 */
const camaraV1 = 'http://www.camara.leg.br/SitCamaraWS';
const camaraV2 = 'https://dadosabertos.camara.leg.br/api/v2';

/**
 * Faz uma série de requisições em um endpoint de listagem paginada;
 * A API V2 da Câmara limita os endpoints de listagem por quantidade de itens
 * por resposta (máximo 100). Caso haja mais itens, ela fornece o link da 
 * próxima requisição. Essa função realiza requisições enquanto houver uma 
 * próxima e agrupa os dados numa lista completa.
 * @param {String} url Url que indica o link da primeira requisição.
 * @param {Number} page Página inicial da consulta. (Inicia em 1)
 * @param {Number} perPage Quantidade de itens por página.
 */
async function getFullList(url, page = initialPage, perPage = limitPerPage) {
  let next = { href: `${ url }&pagina=${ page }&itens=${ perPage }` };
  let fullList = [];
  let res;
  while (next) {
    res = await rp({ url: next.href, json: true });
    next = res.links.find(l => l.rel === 'next');
    fullList.push(res);
  }
  return fullList;
}

/**
 * Obtém uma lista de todos os deputados federais de uma determinada 
 * legislatura. Cada requisição devolve uma quantidade de itens e um link para 
 * a próxima requisição.
 * @param {Number} legislature Número da legislatura atual.
 */
async function getDeputadosListV2(legislature = currentLegislature) {
  return await getFullList(`${ camaraV2 }/deputados?idLegislatura=${ legislature }`);
}

/**
 * Obtém os detalhes de um deputado federal pelo id.
 * @param {Number} id Id do deputado a ser pesquisado.
 */
async function getDeputadoDetail(id) {
  return await rp({ url: `${ camaraV2 }/deputados/${ id }`, json: true });
}

/**
 * Obtém as despesas de um deputado de acordo com seu id e o ano consultado.
 * @param {Number} id Id do deputado cujas despesas serão pesquisadas.
 * @param {Number} year Ano de consulta das despesas. Formato YYYY.
 */
async function getDeputadoExpenses(id, year = currentYear) {
  return {
    id: id,
    expenses: await getFullList(`${ camaraV2 }/deputados/${ id }/despesas?ano=${ year }`)
  };
}

/**
 * Obtém os deputados federais em exercício utilizando a API V1.
 * O retorno é em Xml.
 */
async function getDeputadosListV1() {
  return await rp(`${ camaraV1 }/Deputados.asmx/ObterDeputados`);
}

/**
 * Obtém a lista de presenças de um parlamentar conforme sua matrícula e um
 * intervalo de tempo. Utiliza a API V1.
 * @param {Number} registration Número de matrícula de um deputado federal.
 * @param {String} initialDate Data de início utilizada na consulta com formato DD/MM/YYYY.
 * @param {String} endDate Data de início utilizada na consulta com formato DD/MM/YYYY.
 */
async function getDeputadoFrequency(registration, initialDate = legislatureStart, endDate = today) {
  const query = `dataIni=${ initialDate }&dataFim=${ endDate }&numMatriculaParlamentar=${ registration }`;
  return await rp(`${ camaraV1 }/sessoesreunioes.asmx/ListarPresencasParlamentar?${ query }`);
}

module.exports = {
  getDeputadosListV2,
  getDeputadoDetail,
  getDeputadoExpenses,
  getDeputadosListV1,
  getDeputadoFrequency,
}