const Joi = require('joi');
const { idSchema, yearSchema, monthSchema } = require('./baseSchemas');

const getExpenses = Joi.object().keys({
  query: {
    politicianId: idSchema.required(),
    year: yearSchema.optional(),
    month: monthSchema.optional(),
  }
});

module.exports = {
  getExpenses,
}