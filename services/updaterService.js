const Politico = require('../models/PoliticoModel');
const { toTitleCase, montarEndereco } = require('../utils/utils');

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
          filter: { codigo: d.ultimoStatus.id },
          update: {
            codigo                : d.ultimoStatus.id,
            nomeCivil             : toTitleCase(d.nomeCivil),
            nome                  : toTitleCase(d.ultimoStatus.nome),
            siglaPartido          : d.ultimoStatus.siglaPartido,
            siglaUf               : d.ultimoStatus.siglaUf,
            urlFoto               : d.ultimoStatus.urlFoto,
            email                 : d.ultimoStatus.gabinete.email.toLowerCase(),
            telefone              : d.ultimoStatus.gabinete.telefone,
            descricaoStatus       : d.ultimoStatus.condicaoEleitoral,
            sexo                  : d.sexo,
            dataNascimento        : d.dataNascimento,
            siglaUfNascimento     : d.ufNascimento,
            endereco              : montarEndereco(d.ultimoStatus.gabinete)
          },
          upsert: true
        }
      }
    ));
    await Politico.bulkWrite(bulkOps);
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
            sexo              : s.IdentificacaoParlamentar.SexoParlamentar[0],
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