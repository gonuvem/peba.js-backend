const Joi = require('joi');
const {
  ufSchema, idSchema, termsSchema, pageSchema, perPageSchema
} = require('./baseSchemas');

const searchByUf = Joi.object().keys({
  query: {
    uf: ufSchema.required(),
    page: pageSchema.optional(),
    perPage: perPageSchema.optional()
  }
});

const getById = Joi.object().keys({
  params: {
    id: idSchema.required()
  }
});

const searchByTerms = Joi.object().keys({
  body: {
    terms: termsSchema.required(),
    page: pageSchema.optional(),
    perPage: perPageSchema.optional()
  }
});


module.exports = {
  searchByUf,
  getById,
  searchByTerms,
}