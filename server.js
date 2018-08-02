const app = require('./app');
const init = require('./db');
const { PORT } = process.env || 8080;

/*
app.listen(PORT, function() {
    console.log('%s listening at %s', app.name, app.url);
});
*/

init.then(() => {
    const server = app.listen(PORT, () => {
      const props = server.address()
      console.log('Server is running in PORT: ' + process.env.PORT)
      console.debug(`[${process.env.NODE_ENV}] listening to ${props.address} on port ${props.port}`)
    })
  
    const closeServer = function(){
      server.close(() => {
        console.log('Connection Closed');
        process.exit(0);
      })
  
      setTimeout(() => {
        console.log('shutting down');
        process.exit(1)
      }, 10000)
    }
  
    process.on('SIGTERM', closeServer);
    process.on('SIGINT', closeServer);
});
