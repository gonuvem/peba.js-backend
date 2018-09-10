const errs = require('restify-errors');

const errors = {
  ValidationError: (error) => new errs.BadRequestError(error.message),
  ReferenceError: (error) => new errs.InternalServerError(error.message)
}

exports.handleErr = (req, res, error, callback) => {
  const mappedError = errors[error.name];
  const newError = (mappedError && mappedError(error)) || error;
  res.send(newError)
  return callback()
}