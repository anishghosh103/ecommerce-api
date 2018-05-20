const http = require('http');
const mongoose = require('mongoose');

const appConfig = require('./config/app-config');
const logger = require('./libs/logger');

const Admin = require('./models/Admin');

const app = require('./app');

const server = http.createServer(app);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10);
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
          logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
          process.exit(1);
          break;
      case 'EADDRINUSE':
          logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
          process.exit(1);
          break;
      default:
          logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
          throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
            'pipe ' + addr :
            'port ' + addr.port;
  logger.log('Listening on ' + bind);
  logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
  let db = mongoose.connect(appConfig.db.uri);
}


// handling mongoose connection error
mongoose.connection.on('error', function (err) {
  console.log('database connection error');
  console.log(err);

});

// handling mongoose success event
mongoose.connection.on('open', function (err) {
  if (err) {
      console.log("database error");
      console.log(err);

  } else {
      console.log("database connection open success");
      Admin.findOne({ username: 'admin' })
      .then(admin => {
          if (admin === null) {
            let admin = new Admin({ username: 'admin', password: 'admin', rank: 0 });
            admin.save((err, doc) => {
                if (err) {}
                else { console.log('admin created'); }
            });
          }
      });
  }

});