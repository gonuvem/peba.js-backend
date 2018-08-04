const mongoose = require('mongoose');

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
}, { timestamps: true });

const Politico = mongoose.model('Politico', PoliticoSchema);

module.exports = Politico;