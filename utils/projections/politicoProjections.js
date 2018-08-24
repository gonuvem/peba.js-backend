const politicoListProj = {
  _id           : true,
  nome          : true,
  urlFoto       : true,
  siglaPartido  : true,
  siglaUf       : true,
  cargo         : true,
  totalDespesas : true
};

const politicoDetailProj = {
  _id           : true,
  nome          : true,
  urlFoto       : true,
  siglaPartido  : true,
  siglaUf       : true,
  cargo         : true,
  totalDespesas : true,
  endereco      : true,
  email         : true,
  telefone      : true,
}

module.exports = {
  politicoListProj,
  politicoDetailProj
}