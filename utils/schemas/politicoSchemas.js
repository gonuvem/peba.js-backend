const Joi = require('joi');
const { ufSchema, idSchema } = require('./baseSchemas');

const searchByUf = Joi.object().keys({
  query: {
    uf: ufSchema.required()
  }
});

const getById = Joi.object().keys({
  params: {
    id: idSchema.required()
  }
});


module.exports = {
  searchByUf,
  getById,
}