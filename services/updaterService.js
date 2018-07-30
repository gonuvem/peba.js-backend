const Deputado = require('../models/DeputadoModel');

/**
 * Cria, ou atualiza, as informações dos deputados de forma massiva.
 * @param {Object} deputados Objeto JSON que contém as informações dos 
 * deputados.
 */
async function updateDeputados(deputados) {
  const dados = deputados.map(d => d.dados);
  try {
    const bulkOps = dados.map(d => (
      { 
        updateOne: {
          filter: { idDeputado: d.ultimoStatus.id },
          update: {
            idDeputado            : d.ultimoStatus.id,
            nomeCivil             : d.nomeCivil,
            nome                  : d.ultimoStatus.nome,
            siglaPartido          : d.ultimoStatus.siglaPartido,
            uriPartido            : d.ultimoStatus.uriPartido,
            siglaUf               : d.ultimoStatus.siglaUf,
            idLegislatura         : d.ultimoStatus.idLegislatura,
            urlFoto               : d.ultimoStatus.urlFoto,
            data                  : d.ultimoStatus.data,
            nomeEleitoral         : d.ultimoStatus.nomeEleitoral,
            gabinete              : d.ultimoStatus.gabinete,
            situacao              : d.ultimoStatus.situacao,
            condicaoEleitoral     : d.ultimoStatus.condicaoEleitoral,
            descricaoStatus       : d.ultimoStatus.descricaoStatus,
            cpf                   : d.cpf,
            sexo                  : d.sexo,
            urlWebsite            : d.urlWebsite,
            redeSocial            : d.redeSocial,
            dataNascimento        : d.dataNascimento,
            dataFalecimento       : d.dataFalecimento,
            ufNascimento          : d.ufNascimento,
            municipioNascimento   : d.municipioNascimento,
            escolaridade          : d.escolaridade,
          },
          upsert: true
        }
      }
    ));
    await Deputado.bulkWrite(bulkOps);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updateDeputados
}