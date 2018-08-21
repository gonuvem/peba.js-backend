const Politico = require('../models/PoliticoModel');
const {
  politicoListProj, politicoDetailProj
} = require('../utils/projections/politicoProjections');
const errs = require('restify-errors');

exports.searchByUf = async function (req, res, next) {
  try {
    // Obter sigla Uf, a página e a quantidade resultados por página
    const { uf, page = 0, perPage = 5 } = req.query;

    // Obter o total de políticos dessa Uf e a página requisitada
    const [ total, politicians ] = await Promise.all([
      Politico.find({ siglaUf: uf }).countDocuments(),
      Politico.find({ siglaUf: uf }, politicoListProj).sort('nome')
      .paginate(page, perPage)
    ]);

    // Calcular quantas páginas existem
    const pages = Math.ceil(total / perPage);
    
    // Retornar os políticos encontrados e os dados da paginação
    return res.send({ politicians: politicians, total: total, pages: pages });
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

    // Retorna o político encontrado
    return res.send(politician);
  } catch (error) {
    next(error);
  }
}

exports.searchByTerms = async function (req, res, next) {
  try {
    // Obter array de termos
    const { terms, page = 0, perPage = 5 } = req.body;
    
    // Concatenar termos em uma query
    const query = terms.join(' ');

    // Obter políticos que correspondem à query
    const [ total, politicians ] = await Promise.all([
      Politico.find({ $text : { $search : query } }).countDocuments(),
      Politico.fullTextSearch(query).select(politicoListProj)
      .paginate(page, perPage)
    ]);

    // Calcular quantas páginas existem
    const pages = Math.ceil(total / perPage);

    // Retornar políticos encontrados e os dados da paginação
    return res.send({ politicians: politicians, total: total, pages: pages });
  } catch (error) {
    next(error);
  }
}