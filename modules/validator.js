const Joi = require('joi');
const schemas = require('../utils/schemas/router');

// opções de validação
const _validationOptions = {
  abortEarly: false,  // abortar após o último erro de validação
  allowUnknown: true, // permitir chaves desconhecidas que serão ignoradas
  stripUnknown: true  // remover chaves desconhecidas dos dados validados
};

/**
 * Valida um objeto de acordo com um schema e opções, utilizando o Joi.
 * @param {Object} data Dados a serem validados.
 * @param {Object} schema Schema que valida os dados.
 * @param {Object} options Opções de validação.
 */
function validateData(data, schema, options = _validationOptions) {
  return new Promise((resolve, reject) => {
    const result = Joi.validate(data, schema, options);
    result.error ? reject(result.error) : resolve(result.value);
  });
}

/**
 * Middleware de validação de requisições.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.validateRequest = async function (req, res, next) {
  try {
    // Obter caminho da requisição
    const path = req.getRoute().path;

    // Obter schema correspondente ao caminho
    const schema = schemas[path];

    // Criar objeto que será validado
    const data = { 
      body: req.body,
      params: req.params,
      query: req.query
    }

    // Validar objeto com o schema correspondente
    const validData = await validateData(data, schema);

    // Atualizar a requisição com os dados validados
    [ req.body = req.body, req.params = req.params, req.query = req.query ] 
    = [ validData.body, validData.params, validData.query ]
    
    next()
  } catch (error) {
    next(error);
  }
  
}