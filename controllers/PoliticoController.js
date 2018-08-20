const Politico = require('../models/PoliticoModel');
const { politicoListProj } = require('../utils/projections/politicoProjections');

exports.searchByUf = async function (req, res, next) {
  try {
    // Obter sigla Uf a ser pesquisada
    const uf = req.params.uf;

    // Obter políticos dessa Uf
    const politicians = await Politico
    .find({ siglaUf: uf }, politicoListProj).sort('nome');
    
    // Retornar os políticos encontrados
    return res.send(politicians);
  } catch (error) {
    next(error);
  }
  
}