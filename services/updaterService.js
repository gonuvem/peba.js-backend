const Politico = require('../models/PoliticoModel');
const { toTitleCase, montarEndereco } = require('../utils/utils');

/**
 * Cria, ou atualiza, as informações dos políticos de forma massiva.
 * @param {[Object]} politicos Array de Objeto JSON que contém as informações
 * dos politicos.
 */
async function updatePoliticos(politicos) {
  try {
    const resultado = await Politico.bulkWrite(politicos.map(p => ({
      updateOne: { filter: { codigo: p.codigo }, update: p, upsert: true }
    })));
    console.log(resultado)
    return resultado.upsertedCount;
  } catch (error) {
    throw error;
  }
}

async function updateTotalDespesas(politicos) {
  try {
    const resultado = await Politico.bulkWrite(politicos.map(p => ({
      updateOne: { filter: { nome: p.nome }, update: p, upsert: true }
    })));
    console.log(resultado)
    return resultado.upsertedCount;
  } catch (error) {
    throw error;
  }
}

async function updateTotalDespesasDeputados(politicos) {
  try {
    const resultado = await Politico.bulkWrite(politicos.map(p => ({
      updateOne: { filter: { codigo: p.codigo }, update: p, upsert: true }
    })));
    console.log(resultado)
    return resultado.upsertedCount;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updatePoliticos,
  updateTotalDespesas,
  updateTotalDespesasDeputados
}