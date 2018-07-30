const rp = require('request-promise-any');
const { poolAll } = require('swimmer');

/**
 * URL base da nova API de Dados Abertos da Câmara dos Deputados.
 * Mais informações:
 * https://dadosabertos.camara.leg.br/swagger/api.html
 */
const baseUrl = 'https://dadosabertos.camara.leg.br/api/v2';

/**
 * Obtêm os ids de todos os 513 deputados federais. Cada requisição devolve
 * uma qtd de páginas e um link para a próxima requisição.
 * @param {Number} qtd Inteiro que limita a quantidade de itens por página.
 * Máximo: 100.
 */
async function getDeputadosIds(qtd=100) {
  let next = { href: `${baseUrl}/deputados?pagina=1&itens=${qtd}` };
  let deputadosIds = [];
  let res;
  try {
    while(next) {
      res = await rp({ url: next.href, json: true });
      deputadosIds = deputadosIds.concat(res.dados.map(d => d.id));
      next = res.links.find(l => l.rel === 'next');
    }
    return deputadosIds; 
  } catch (error) {
    throw error;
  }
}

/**
 * Obtêm os detalhes de um deputado federal pelo id.
 * @param {Number} id Id do deputado a ser pesquisado.
 */
async function getDeputadoById(id) {
  return await rp({ url: `${baseUrl}/deputados/${id}`, json: true });
}

/**
 * Obtêm os detalhes de todos os deputados de acordo com os ids. As requisições
 * são feitas paralelamente, respeitando um limite de concorrência.
 * @param {[Number]} deputadosIds Lista de Ids dos deputados a serem 
 * pesquisados.
 */
async function getTodosDeputados(deputadosIds) {
  try {
    const concurrency = 20;
    const res = await poolAll(deputadosIds.map(id => 
      () => getDeputadoById(id)), concurrency);
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * Obtêm as despesas de um deputado de acordo com seu id.
 * @param {Number} id Id do deputado cujas despesas serão pesquisadas.
 */
async function getDespesasByDeputadoId(id) {
  return await rp({ url: `${baseUrl}/deputados/${id}/despesas`, json: true });
}

/**
 * Obtêm as despesas de todos os deputados de acordo com os ids. As requisições
 * são feitas paralelamente, respeitando um limite de concorrência.
 * @param {[Number]} deputadosIds Lista de Ids dos deputados cujas despesas
 * serão pesquisadas.
 */
async function getDespesasTodosDeputados(deputadosIds) {
  try {
    const concurrency = 20;
    const res = await poolAll(deputadosIds.map(id => 
      () => getDespesasByDeputadoId(id)), concurrency);
    return res;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getDeputadosIds,
  getTodosDeputados,
  getDespesasByDeputadoId,
  getDespesasTodosDeputados,
}