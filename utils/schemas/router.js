const { searchByUf, getById, searchByTerms } = require('./politicoSchemas');
const { sendEmailToPolitician } = require('./mailerSchemas');
const { createTerm, listTerms } = require('./glossarySchemas');

module.exports = {
    'GET /politicos'        : searchByUf,
    'GET /politicos/:id'    : getById,
    'POST /politicos'       : searchByTerms,

    'POST /email'           : sendEmailToPolitician,

    'POST /glossary'        : createTerm,
    'GET /glossary'         : listTerms,
}