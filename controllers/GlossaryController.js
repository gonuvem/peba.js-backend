const Glossary = require('../models/GlossaryModel');
const { glossaryListProj } =require('../utils/projections/glossaryProjections');
const errs = require('restify-errors');

exports.create = async function(req, res, next) {
  try {
    const { term, definition } = req.body;

    const termFound = await Glossary.findOneAndUpdate({ term: term });
    if (termFound) throw new errs.ConflictError('Termo já cadastrado');

    const result = await Glossary
    .create({ term: term, definition: definition });

    return res.send(result);
  } catch (error) {
    next(error);
  }
}

exports.list = async function(req, res, next) {
  try {
    const { letter, page = 0, perPage = 5 } = req.query;

    const query = new RegExp('^'+letter+'\\w+'+'$', 'i');
    
    // Obter termos
    const [ total, terms ] = await Promise.all([
      Glossary.find({ term: query }).countDocuments(),
      Glossary.find({ term: query }, glossaryListProj).sort('term')
      .paginate(page, perPage)
    ]);

    // Calcular quantas páginas existem
    const pages = Math.ceil(total / perPage);
    
    // Retornar os termos encontrados e os dados da paginação
    return res.send({ terms: terms, total: total, pages: pages });
  } catch (error) {
    next(error);
  } 
}