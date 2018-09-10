const { searchByUf } = require('./politicoSchemas');

module.exports = {
    '/politicos/:uf': searchByUf
}