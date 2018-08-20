const { searchByUf, getById } = require('./politicoSchemas');

module.exports = {
    '/politicos': searchByUf,
    '/politicos/:id': getById
}