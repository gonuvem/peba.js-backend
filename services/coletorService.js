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
 * Obtém uma lista de todos os 513 deputados federais. Cada requisição devolve
 * uma qtd de itens e um link para a próxima requisição.
 * @param {Number} qtd Inteiro que limita a quantidade de itens por página.
 * Máximo: 100.
 */
async function getDeputadosLista(qtd=100) {
  let next = { href: `${camaraAPI}/deputados?pagina=1&itens=${qtd}` };
  let deputadosLista = [];
  let res;
  try {
    while(next) {
      res = await rp({ url: next.href, json: true });
      next = res.links.find(l => l.rel === 'next');
      deputadosLista.push(res);
    }
    return deputadosLista; 
  } catch (error) {
    throw error;
  }
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
  try {
    return await poolAll(deputadosIds.map(id => 
      () => getDeputadoById(id)), concurrency);
  } catch (err) {
    throw err;
  }
}

/**
 * Obtém as despesas de um deputado de acordo com seu id.
 * @param {Number} id Id do deputado cujas despesas serão pesquisadas.
 */
async function getDespesasByDeputadoId(id) {
  return await rp({ 
    url: `${camaraAPI}/deputados/${id}/despesas`, json: true });
}

/**
 * Obtém as despesas de todos os deputados de acordo com os ids. As requisições
 * são feitas paralelamente, respeitando um limite de concorrência.
 * @param {[Number]} deputadosIds Lista de Ids dos deputados cujas despesas
 * serão pesquisadas.
 */
async function getDespesasTodosDeputados(deputadosIds, concurrency=20) {
  try {
    return await poolAll(deputadosIds.map(id => 
      () => getDespesasByDeputadoId(id)), concurrency);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtém a lista de senadores em exercício.
 */
async function getSenadoresEmExercicio() {
  return await rp({ url: `${senadoAPI}/senador/lista/atual`, json: true });
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
  try {
    return await poolAll(codigos.map(codigo => 
      () => getDetalhesSenador(codigo)), concurrency);
  } catch (error) {
    throw error;
  }
}

async function obterDeputadosV1() {
  return await rp('http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterDeputados');
}

async function obterRelatorioDePresenca(matricula, legislatura=55, dataInicio='01/02/2015', dataFim='22/08/2018') {
  const options = {
    headers: { 'user-agent': 'node.js' }
  }  
  return await rp(`http://www.camara.leg.br/internet/deputado/RelPresencaPlenario.asp?nuLegislatura=${ legislatura }&nuMatricula=${ matricula }&dtInicio=${ dataInicio }&dtFim=${ dataFim }`, options);
}

module.exports = {
  getDeputadosLista,
  getDeputadoById,
  getTodosDeputados,
  getDespesasByDeputadoId,
  getDespesasTodosDeputados,
  getSenadoresEmExercicio,
  getDetalhesSenador,
  getDetalhesTodosSenadores,
  getDespesasSenadoresCsv,
  getTodasDespesasDeputado,
  getTodasDespesasTodosDeputados,
  getSenadoresLegislatura,
  obterDeputadosV1,
  obterRelatorioDePresenca
}