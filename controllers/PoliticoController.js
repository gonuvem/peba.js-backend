const Politico = require('../models/PoliticoModel');
const {
  politicoListProj, politicoDetailProj
} = require('../utils/projections/politicoProjections');
const errs = require('restify-errors');

exports.searchByUf = async function (req, res, next) {
  try {
    // Obter sigla Uf a ser pesquisada
    const uf = req.query.uf;

    // Obter políticos dessa Uf
    const politicians = await Politico
    .find({ siglaUf: uf }, politicoListProj).sort('nome');
    
    // Retornar os políticos encontrados
    return res.send(politicians);
  } catch (error) {
    next(error);
  }
}

exports.getById = async function (req, res, next) {
  try {
    // Obter id do político
    const id = req.params.id;
    
    // Obter politico pelo id
    const politician = await Politico.findById(id, politicoDetailProj);
    if(!politician) throw new errs.NotFoundError('Político não encontrado');

    // Retorna o político não encontrado
    return res.send(politician);
  } catch (error) {
    next(error);
  }
}