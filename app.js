const restify = require('restify');
const server = restify.createServer();

// Requisitar rotas
const deputadoRoute = require('./routes/DeputadoRoute');
const despesaRoute = require('./routes/DespesaRoute');

// Montar rotas
deputadoRoute.applyRoutes(server, '/deputados');
despesaRoute.applyRoutes(server, '/despesas');

module.exports = server;