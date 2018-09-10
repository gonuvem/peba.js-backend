const Joi = require('joi');
const { currentYear } = require('../utils');

module.exports = {
  idSchema: Joi.string().regex(/^[0-9a-fA-F]{24}$/).strict(),
  ufSchema: Joi.string().length(2).uppercase().strict(),
  termsSchema: Joi.array().min(1).items(Joi.string().strict().required()),
  emailSchema: Joi.string().email(),
  pageSchema: Joi.number().integer().min(0),
  perPageSchema: Joi.number().integer().min(1),
  yearSchema: Joi.number().min(currentYear - 5).max(currentYear),
  monthSchema: Joi.number().min(1).max(12),
}