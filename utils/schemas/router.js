const { searchByUf, getById, searchByTerms } = require('./politicoSchemas');
const { sendEmailToPolitician } = require('./mailerSchemas');

module.exports = {
    'GET /politicos'        : searchByUf,
    'GET /politicos/:id'    : getById,
    'POST /politicos'       : searchByTerms,

    'POST /email'           : sendEmailToPolitician,
}