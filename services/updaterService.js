const Politico = require('../models/PoliticoModel');

/**
 * Cria, ou atualiza, as informações dos políticos de forma massiva.
 * Utiliza o nome do político como filtro.
 * @param {[Object]} politicians Array de Objeto JSON que contém as informações
 * dos politicos.
 */
async function updatePoliticiansByName(politicians) {
  try {
    const result = await Politico.bulkWrite(politicians.map(p => ({
      updateOne: { filter: { nome: p.nome }, update: p, upsert: true }
    })));
    console.log(result)
    return result.upsertedCount + result.modifiedCount;
  } catch (error) {
    throw error;
  }
}

/**
 * Cria, ou atualiza, as informações dos políticos de forma massiva.
 * Utiliza o código do político como filtro.
 * @param {[Object]} politicians Array de Objeto JSON que contém as informações
 * dos politicos.
 */
async function updatePoliticiansByCode(politicians) {
  try {
    const result = await Politico.bulkWrite(politicians.map(p => ({
      updateOne: { filter: { codigo: p.codigo }, update: p, upsert: true }
    })));
    console.log(result)
    return result.upsertedCount + result.modifiedCount;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  updatePoliticiansByName,
  updatePoliticiansByCode
}