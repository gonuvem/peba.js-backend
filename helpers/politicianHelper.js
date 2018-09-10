const Politico = require('../models/PoliticoModel');

async function getPoliticoId(cargo, codigo) {
  return await Politico.findOne({ cargo: cargo, codigo: codigo }, '_id');
}

async function getPoliticoMapCodeId(cargo) {
  const politicians = await Politico.find({ cargo: cargo }, '_id codigo');
  return politicians.reduce((mapCodeId, p) => 
  (mapCodeId[p.codigo] = p._id, mapCodeId), {});
}

async function getPoliticoMapNameId(cargo) {
  const politicians = await Politico.find({ cargo: cargo }, '_id nome');
  return politicians.reduce((mapCodeId, p) => 
  (mapCodeId[p.nome] = p._id, mapCodeId), {});
}

module.exports = {
  getPoliticoId,
  getPoliticoMapCodeId,
  getPoliticoMapNameId,
}