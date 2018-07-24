const rp = require('request-promise-any');

async function recuperarDeputados(){
    const deputadosXML = await rp("http://www.camara.gov.br/SitCamaraWS/Deputados.asmx/ObterDeputados");
}

module.exports = {
    recuperarDeputados
}