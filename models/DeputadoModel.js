const mongoose = require('mongoose');

const DeputadoSchema = new mongoose.Schema({
  ideCadastro: {
    type: String,
    required: true
  },
  codOrcamento: {
    type: String,
    required: true
  },
  condicao: {
    type: String,
    enum: ['Titular', 'Suplente'],
    required: true
  },
  matricula: {
    type: String,
    required: true
  },
  idParlamentar: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  nomeParlamentar: {
    type: String,
    required: true
  },
  urlFoto: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    enum: ['masculino', 'feminino'],
    required: true
  },
  uf: {
    type: String,
    required: true
  },
  partido: {
    type: String,
    required: true
  },
  gabinete: {
    type: String,
    required: true
  },
  anexo: {
    type: String,
    required: true
  },
  fone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  comissoes: {
    titular: {
      type: String
    },
    suplente: {
      type: String
    }
  }
}, { timestamps: true });

const Deputado = mongoose.model('Deputado', DeputadoSchema);

module.exports = Deputado;