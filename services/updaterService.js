const Politico = require('../models/PoliticoModel');
const { toTitleCase, montarEndereco } = require('../utils/utils');

/**
 * Cria, ou atualiza, as informações dos políticos de forma massiva.
 * @param {[Object]} politicos Array de Objeto JSON que contém as informações
 * dos politicos.
 */
async function updatePoliticos(politicos) {
  try {
    await Politico.bulkWrite(politicos.map(p => ({
      updateOne: { filter: { codigo: p.codigo }, update: p, upsert: true }
    })));
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updatePoliticos,
}