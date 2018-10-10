const restify = require('restify');
const server = restify.createServer();
const { handleErr } = require('./modules/errorHandler');

// Requisitar rotas
const deputadoRoute = require('./routes/DeputadoRoute');
const despesaRoute = require('./routes/ExpenseRoute');
const politicoRoute = require('./routes/PoliticoRoute');
// const mailerRoute = require('./routes/MailerRoute');
const glossaryRoute = require('./routes/GlossaryRoute');

// Montar rotas
deputadoRoute.applyRoutes(server, '/deputados');
despesaRoute.applyRoutes(server, '/expenses');
politicoRoute.applyRoutes(server, '/politicos');
// mailerRoute.applyRoutes(server, '/email');
glossaryRoute.applyRoutes(server, '/glossary');

// Habilitar CORS
server.pre((req, res, next) => {
  const allowedOrigins = [
    'http://www.projetopeba.com.br',
    'http://projetopeba.com.br',
  ];
  const origin = req.headers.origin;
  if(allowedOrigins.includes(origin)){
    res.header("Access-Control-Allow-Origin", origin);
  }
  next();
});
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.on('restifyError', handleErr);

module.exports = server;