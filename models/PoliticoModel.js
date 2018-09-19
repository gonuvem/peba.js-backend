const mongoose = require('mongoose');
require('../models/ExpenseModel');

const PoliticoSchema = new mongoose.Schema({
  codigo                : { type: String, required: true },
  nome                  : { type: String, required: true },
  urlFoto               : { type: String, required: true },
  siglaPartido          : { type: String, required: true },
  siglaUf               : { type: String, required: true },
  descricaoStatus       : { type: String, required: true },
  endereco              : { type: String, required: true },
  email                 : { type: String, required: true },
  telefone              : { type: String, required: true },
  nomeCivil             : { type: String, required: true },
  sexo                  : { type: String, required: true },
  dataNascimento        : { type: Date  , required: true },
  siglaUfNascimento     : { type: String, required: true },
  totalDespesas         : { type: String, default: "0.00" },
  cargo                 : { type: String, enum: ['Senador', 'Deputado Federal'], required: true },
  situacao              : { type: String },
  registration: String,
  frequency: {
    total: Number, presence: Number, justifiedAbsence: Number, unjustifiedAbsence: Number
  },
  atualizacao: Date,
}, { timestamps: true });

PoliticoSchema.index(
  {
    nome: 'text',
    siglaPartido: 'text',
    siglaUf: 'text',
    nomeCivil: 'text',
  },
  {
    name: 'SearchIndex',
    weights: {
      nome: 2,
      siglaPartido: 2,
      siglaUf: 2,
      nomeCivil: 1
    }
  }
);

/**
 * Faz a paginação dos resultados segundo uma quantidade de resultados por
 * página e o número da página. Considera que a numeração inicia no 0.
 * @param {Number} page Numéro da página.
 * @param {Number} perPage Quantidade de resultados por página.
 */
PoliticoSchema.query.paginate = function(page, perPage) {
  return this.skip(page * perPage).limit(perPage);
}

/**
 * Dada um texto, consulta os campos indexados e ordena os resultados de
 * acordo com o score (baseado nos pesos).
 * @param {String} query Texto a ser consultado.
 */
PoliticoSchema.statics.fullTextSearch = function(query) {
  return this
  .find({ $text : { $search : query } }, { score : { $meta: "textScore" } })
  .sort({ score : { $meta : 'textScore' } });
}

const Politico = mongoose.model('Politico', PoliticoSchema);

module.exports = Politico;