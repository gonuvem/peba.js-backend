const { searchByUf, getById, searchByTerms } = require('./politicoSchemas');

module.exports = {
    'GET /politicos'        : searchByUf,
    'GET /politicos/:id'    : getById,
    'POST /politicos'       : searchByTerms,
}