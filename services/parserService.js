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

module.exports = {
  converterXmlParaJson,
  validarXml
}