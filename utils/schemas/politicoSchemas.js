const Joi = require('joi');
const { uf } = require('./baseSchemas');

const searchByUf = Joi.object().keys({
  params: {
    uf: uf.required()
  }
});


module.exports = {
  searchByUf
}