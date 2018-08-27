const mongoose = require('mongoose');

const GlossarySchema = new mongoose.Schema({
  term: { type: String, unique: true },
  definition: String
});

/**
 * Faz a paginação dos resultados segundo uma quantidade de resultados por
 * página e o número da página. Considera que a numeração inicia no 0.
 * @param {Number} page Numéro da página.
 * @param {Number} perPage Quantidade de resultados por página.
 */
GlossarySchema.query.paginate = function(page, perPage) {
  return this.skip(page * perPage).limit(perPage);
}
/**
 * Links úteis:
 * http://www2.camara.leg.br/glossario
 * https://www12.senado.leg.br/noticias/glossario-legislativo
 */


const Glossary = mongoose.model('Glossary', GlossarySchema);

module.exports = Glossary;