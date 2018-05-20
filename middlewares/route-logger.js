const apiConfig = require('../config/app-config');
const logger = require('../libs/logger');

let log = (req, res, next) => {
  let remoteIp = req.connection.remoteAddress + '://' + req.connection.remotePort;
  logger.log(`${req.method} Request Made From ${remoteIp} for route ${req.originalUrl}`);

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    //respond with 200
    res.send(200);
  } else {
    //move on
    next();
  }
};

module.exports = { log };