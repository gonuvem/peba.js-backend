const Joi = require('joi');

module.exports = {
  idSchema: Joi.string().regex(/^[0-9a-fA-F]{24}$/).strict(),
  ufSchema: Joi.string().length(2).uppercase().strict(),
  termsSchema: Joi.array().min(1).items(Joi.string().strict().required())
}