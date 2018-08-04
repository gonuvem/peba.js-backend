const Deputado = require('../models/DeputadoModel');
const Politico = require('../models/PoliticoModel');

/**
 * Cria, ou atualiza, as informações dos deputados de forma massiva.
 * @param {[Object]} deputados Array de Objeto JSON que contém as informações
 * dos deputados adquiridas do endpoint de detalhes da API da Câmara.
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

/**
 * Cria, ou atualiza, as informações dos senadores de forma massiva.
 * @param {[Object]} senadores Array de Objeto JSON que contém as informações
 * dos senadores adquiridas do endpoint de detalhes da API do Senado.
 */
async function updateSenadores(senadores) {
  try {
    // Criar as operações de bulk de updateOne para cada senador
    const bulkOps = senadores.map(s => s.DetalheParlamentar.Parlamentar)
    .map(s => (
      {
        updateOne: {
          filter: { codigo: s.IdentificacaoParlamentar.CodigoParlamentar },
          update: {
            codigo            : s.IdentificacaoParlamentar.CodigoParlamentar,
            nome              : s.IdentificacaoParlamentar.NomeParlamentar,
            urlFoto           : s.IdentificacaoParlamentar.UrlFotoParlamentar,
            siglaPartido      : s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
            siglaUf           : s.IdentificacaoParlamentar.UfParlamentar,
            descricaoStatus   : s.MandatoAtual.DescricaoParticipacao,
            endereco          : s.DadosBasicosParlamentar.EnderecoParlamentar,
            email             : s.IdentificacaoParlamentar.EmailParlamentar,
            telefone          : s.DadosBasicosParlamentar.TelefoneParlamentar,
            nomeCivil         : s.IdentificacaoParlamentar.NomeCompletoParlamentar,
            sexo              : s.IdentificacaoParlamentar.SexoParlamentar,
            dataNascimento    : s.DadosBasicosParlamentar.DataNascimento,
            siglaUfNascimento : s.DadosBasicosParlamentar.UfNaturalidade,
          },
          upsert: true
        }
      }
    ));
    // Realiza a operação de bulk atualizando os senadores em uma operação
    await Politico.bulkWrite(bulkOps);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updateDeputados,
  updateSenadores,
}