const Joi = require('joi');

module.exports = {
    uf: Joi.string().length(2).uppercase(),

}