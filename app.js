const restify = require('restify');
const server = restify.createServer();
const { handleErr } = require('./modules/errorHandler');

// Inicar tarefas agendadas
const { updatePoliticosJob } = require('./services/schedulerService');
updatePoliticosJob.start();

// Requisitar rotas
const deputadoRoute = require('./routes/DeputadoRoute');
const despesaRoute = require('./routes/DespesaRoute');
const politicoRoute = require('./routes/PoliticoRoute');

// Montar rotas
deputadoRoute.applyRoutes(server, '/deputados');
despesaRoute.applyRoutes(server, '/despesas');
politicoRoute.applyRoutes(server, '/politicos');

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.on('restifyError', handleErr);

module.exports = server;