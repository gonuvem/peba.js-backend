const mongoose = require('mongoose');

const DeputadoSchema = new mongoose.Schema({
  idDeputado            : { type: Number, required: true },
  nomeCivil             : { type: String, required: true },
  nome                  : { type: String, required: true },
  siglaPartido          : { type: String, required: true },
  uriPartido            : { type: String, required: true },
  siglaUf               : { type: String, required: true },
  idLegislatura         : { type: Number, required: true },
  urlFoto               : { type: String, required: true },
  data                  : { type: Date,   required: true },
  nomeEleitoral         : { type: String, required: true },
  gabinete: {
    nome                : { type: String, required: true },
    predio              : { type: String, required: true },
    sala                : { type: String, required: true },
    andar               : { type: String, required: true },
    telefone            : { type: String, required: true },
    email               : { type: String, required: true },
  },
  situacao              : { type: String, required: true },
  condicaoEleitoral     : { type: String, required: true },
  descricaoStatus       : { type: String },
  cpf                   : { type: String, required: true },
  sexo                  : { type: String, required: true },
  urlWebsite            : { type: String, required: true },
  redeSocial            : [{ type: String, required: true }],
  dataNascimento        : { type: Date,   required: true },
  dataFalecimento       : { type: Date },
  ufNascimento          : { type: String, required: true },
  municipioNascimento   : { type: String, required: true },
  escolaridade          : { type: String, required: true }
}, { timestamps: true });

const Deputado = mongoose.model('Deputado', DeputadoSchema);

module.exports = Deputado;