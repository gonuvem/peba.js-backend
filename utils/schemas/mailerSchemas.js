const Joi = require('joi');
const { emailSchema } = require('./baseSchemas');

const sendEmailToPolitician = Joi.object().keys({
  body: {
    from: emailSchema.required(),
    to: emailSchema.required(),
    subject: Joi.string().strict().required(),
    message: Joi.string().strict().required(),
  }
});

module.exports = {
  sendEmailToPolitician,
}