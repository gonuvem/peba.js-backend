const rp = require('request-promise-any');
const { poolAll } = require('swimmer');

/**
 * URL base da nova API de Dados Abertos da Câmara dos Deputados.
 * Mais informações:
 * https://dadosabertos.camara.leg.br/swagger/api.html
 */
const camaraAPI = 'https://dadosabertos.camara.leg.br/api/v2';

/**
 * URL base da API de Dados Abertos do Senado.
 * Mais informações:
 * http://legis.senado.leg.br/dadosabertos/docs
 */
const senadoAPI = 'http://legis.senado.leg.br/dadosabertos';

/**
 * Faz uma série de requisições em um endpoint de listagem paginada;
 * A API da Câmara limita os endpoints de listagem por quantidade de itens por
 * resposta (máximo 100). Caso haja mais itens, ela fornece o link da próxima
 * requisição. Essa função realiza requisições enquanto houver uma próxima e
 * agrupa os dados numa lista completa.
 * @param {Object} next Objeto com um campo (href) que indica o link da
 * primeira requisição.
 */
async function getFullList(next) {
  let fullList = [];
  let res;
  while(next) {
    res = await rp({ url: next.href, json: true });
    next = res.links.find(l => l.rel === 'next');
    fullList.push(res);
  }
  return fullList;
}

/**
 * Obtém uma lista de todos os deputados federais de uma determinada 
 * legislatura. Cada requisição devolve uma qtd de itens e um link para a 
 * próxima requisição.
 * @param {Number} qtd Inteiro que limita a quantidade de itens por página.
 * Máximo: 100.
 */
async function getDeputadosLista(legislatura=55,qtd=100) {
  return await getFullList({
    href: `${camaraAPI}/deputados?idLegislatura=${legislatura}&pagina=1&itens=${qtd}`
  });
}

/**
 * Obtém os detalhes de um deputado federal pelo id.
 * @param {Number} id Id do deputado a ser pesquisado.
 */
async function getDeputadoById(id) {
  return await rp({ url: `${camaraAPI}/deputados/${id}`, json: true });
}

/**
 * Obtém os detalhes de todos os deputados de acordo com os ids. As requisições
 * são feitas paralelamente, respeitando um limite de concorrência.
 * @param {[Number]} deputadosIds Lista de Ids dos deputados a serem 
 * pesquisados.
 */
async function getTodosDeputados(deputadosIds, concurrency=20) {
  return await poolAll(deputadosIds.map(id => 
    () => getDeputadoById(id)), concurrency
  );
}

/**
 * Obtém as despesas de um deputado de acordo com seu id.
 * @param {Number} id Id do deputado cujas despesas serão pesquisadas.
 */
async function getTodasDespesasDeputado(id, ano=2018, qtd=100) {
  return {
    id: id,
    despesas: await getFullList({
      href: `${camaraAPI}/deputados/${id}/despesas?ano=${ano}&pagina=1&itens=${qtd}`
    })
  };
}

/**
 * Obtém as despesas de todos os deputados de acordo com os ids. As requisições
 * são feitas paralelamente, respeitando um limite de concorrência.
 * @param {[Number]} deputadosIds Lista de Ids dos deputados cujas despesas
 * serão pesquisadas.
 */
async function getTodasDespesasTodosDeputados(deputadosIds, concurrency=20) {
  return await poolAll(deputadosIds.map(id => 
    () => getTodasDespesasDeputado(id)), concurrency
  );
}

/**
 * Obtém a lista de todos os senadores de uma dada legislatura.
 * @param {Number} legislatura Número da legislatura.
 */
async function getSenadoresLegislatura(legislatura=55) {
  return await rp({
    url: `${senadoAPI}/senador/lista/legislatura/${legislatura}`,
    json: true 
  });
}

/**
 * Obtém os detalhes de um senador de acordo com o código.
 * @param {String} codigo Código do senador.
 */
async function getDetalhesSenador(codigo) {
  return await rp({ url: `${senadoAPI}/senador/${codigo}`, json: true });
}

/**
 * Obtém os detalhes de todos os senadores de acordo com os codigos.
 * As requisições são feitas paralelamente, respeitando um limite de 
 * concorrência.
 * @param {[String]} codigos Array de strings de códigos de senadores.
 * @param {Number} concurrency Inteiro que limita a quantidade de requisições
 * paralelas.
 */
async function getDetalhesTodosSenadores(codigos, concurrency=20) {
  return await poolAll(codigos.map(codigo => 
    () => getDetalhesSenador(codigo)), concurrency
  );
}

/**
 * Faz o download de um arquivo csv com as despesas de todos os senadores 
 * referente a Cota para o Exercício da Atividade Parlamentar dos Senadores
 * CEAPS.
 */
async function getDespesasSenadoresCsv() {
  return await rp('http://www.senado.gov.br/transparencia/LAI/verba/2018.csv',
    { encoding: 'latin1' }
  );
}

module.exports = {
  getDeputadosLista,
  getDeputadoById,
  getTodosDeputados,
  getDetalhesSenador,
  getDetalhesTodosSenadores,
  getDespesasSenadoresCsv,
  getTodasDespesasDeputado,
  getTodasDespesasTodosDeputados,
  getSenadoresLegislatura
}