const fastXmlParser = require('fast-xml-parser');

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

module.exports = {
  converterXmlParaJson,
  validarXml,
  getDeputadosIds,
  getSenadoresCodigos,
}