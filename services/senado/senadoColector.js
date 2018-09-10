const rp = require('request-promise-any');

const currentLegislature = 55;
const currentYear = 2018;

/**
 * URL base da API de Dados Abertos do Senado.
 * Mais informações:
 * http://legis.senado.leg.br/dadosabertos/docs
 */
const senadoAPI = 'http://legis.senado.leg.br/dadosabertos';

/**
 * Obtém a lista de todos os senadores de uma dada legislatura.
 * @param {Number} legislature Número da legislatura.
 */
async function getSenadoresList(legislature = currentLegislature) {
  return await rp({
    url: `${ senadoAPI }/senador/lista/legislatura/${ legislature }`,
    json: true
  });
}

/**
 * Obtém os detalhes de um senador de acordo com o código.
 * @param {String} code Código do senador.
 */
async function getSenadorDetail(code) {
  return await rp({ url: `${ senadoAPI }/senador/${ code }`, json: true });
}

/**
 * Faz o download de um arquivo csv com as despesas de todos os senadores 
 * referente a Cota para o Exercício da Atividade Parlamentar dos Senadores
 * CEAPS de um determinado ano.
 * @param {Number} year Ano de consulta das despesas.
 */
async function getSenadoresExpensesCsv(year = currentYear) {
  return await rp(`http://www.senado.gov.br/transparencia/LAI/verba/${ year }.csv`,
    { encoding: 'latin1' }
  );
}

module.exports = {
  getSenadoresList,
  getSenadorDetail,
  getSenadoresExpensesCsv,
}

