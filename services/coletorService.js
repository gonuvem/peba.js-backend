const rp = require('request-promise-any');

/**
 * Retorna um arquivo XML que contém as informações dos 513 deputados federais.
 */
async function recuperarDeputados() {
  try {
    return await rp("http://www.camara.gov.br/SitCamaraWS/Deputados.asmx/ObterDeputados");
  } catch (error) {
    throw error;
  }
}

module.exports = {
  recuperarDeputados
}