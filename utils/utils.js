const { poolAll } = require('swimmer');
/**
 * Transforma cada primeira letra de um texto em letra maiúsculas enquanto as
 * outras são transformadas para minúsculas.
 * @param {String} str String com um texto
 * 
 * BUG: Corrigir quando a primeira letra é acentuada. Ex.: Úrsula
 */
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Monta um endereço de um deputado com base nas informações do gabinete.
 * @param {Object} gabinete Objeto com informações do gabinete de um deputado.
 * 
 * TODO: Evitar campos como undefined e null.
 */
function montarEndereco(gabinete) {
  return `Gabinete ${gabinete.nome}, Prédio ${gabinete.predio}, ` + 
  `Sala ${gabinete.sala}, Andar ${gabinete.andar}`
}

/**
 * Remove os acentos de uma palavra.
 * @param {String} str Palavra com acentos.
 */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

/**
 * 
 * @param {Function} asyncFunc Função assíncrona que retorna uma Promise
 * @param {Array} paramList Array de parâmetros, um para cada chamda
 * @param {Number} concurrency Quantidade de chamadas à função de modo 
 * concorrente
 */
async function parallelPromises(asyncFunc, paramList, concurrency=20) {
  return await poolAll(paramList.map(param => () => asyncFunc(param)),
  concurrency);
}


module.exports = {
  toTitleCase,
  montarEndereco,
  removeAccents,
  parallelPromises,
}