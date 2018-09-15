const Joi = require('joi');
const {
  idSchema, yearSchema, monthSchema, pageSchema, perPageSchema
} = require('./baseSchemas');

const getExpenses = Joi.object().keys({
  query: {
    politicianId: idSchema.required(),
    year: yearSchema.optional(),
    month: monthSchema.optional(),
    page: pageSchema.optional(),
    perPage: perPageSchema.optional()
  }
});

const getChartsData = Joi.object().keys({
  query: {
    politicianId: idSchema.required(),
  }
});

module.exports = {
  getExpenses,
  getChartsData,
}