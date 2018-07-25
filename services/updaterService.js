const Deputado = require('../models/DeputadoModel');

/**
 * Cria, ou atualiza, as informações dos deputados de forma massiva.
 * @param {Object} data Objeto JSON convertido do XML que contém as informações
 * dos deputados.
 */
async function updateDeputados(data) {
  try {
    const deputados = data.deputados.deputado;
    const bulkOps = deputados.map(d => (
      { 
        updateOne: {
          filter: { ideCadastro: d.ideCadastro },
          update: {
            ideCadastro: d.ideCadastro,
            codOrcamento: d.codOrcamento,
            condicao: d.condicao,
            matricula: d.matricula,
            idParlamentar: d.idParlamentar,
            nome: d.nome,
            nomeParlamentar: d.nomeParlamentar,
            urlFoto: d.urlFoto,
            sexo: d.sexo,
            uf: d.uf,
            partido: d.partido,
            gabinete: d.gabinete,
            anexo: d.anexo,
            fone: d.fone,
            email: d.email,
            comissoes: d.comissoes
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