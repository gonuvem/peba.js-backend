const Joi = require('joi');
const {
  pageSchema, perPageSchema
} = require('./baseSchemas');

const createTerm = Joi.object().keys({
  body: {
    term: Joi.string().strict().required(),
    definition: Joi.string().strict().required(),
  }
});

const listTerms = Joi.object().keys({
  query: {
    letter: Joi.string().length(1).strict().required(),
    page: pageSchema.optional(),
    perPage: perPageSchema.optional()
  }
});

module.exports = {
  createTerm,
  listTerms
}
