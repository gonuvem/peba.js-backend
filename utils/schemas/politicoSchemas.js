const Joi = require('joi');
const { ufSchema, idSchema, termsSchema } = require('./baseSchemas');

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

const searchByTerms = Joi.object().keys({
  body: {
    terms: termsSchema.required()
  }
});


module.exports = {
  searchByUf,
  getById,
  searchByTerms,
}