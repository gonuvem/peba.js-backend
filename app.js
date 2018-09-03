const restify = require('restify');
const server = restify.createServer();
const { handleErr } = require('./modules/errorHandler');

// Inicar tarefas agendadas
const { updatePoliticiansJob } = require('./tasks/scheduler');

// Requisitar rotas
const deputadoRoute = require('./routes/DeputadoRoute');
const despesaRoute = require('./routes/ExpenseRoute');
const politicoRoute = require('./routes/PoliticoRoute');
const mailerRoute = require('./routes/MailerRoute');
const glossaryRoute = require('./routes/GlossaryRoute');

// Montar rotas
deputadoRoute.applyRoutes(server, '/deputados');
despesaRoute.applyRoutes(server, '/expenses');
politicoRoute.applyRoutes(server, '/politicos');
mailerRoute.applyRoutes(server, '/email');
glossaryRoute.applyRoutes(server, '/glossary');

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.on('restifyError', handleErr);

module.exports = server;