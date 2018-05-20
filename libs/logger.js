const pino = require('pino')();
const moment = require('moment');
const appConfig = require('../config/app-config');

let error = (message, origin, level = 0) => {
  if (appConfig.env !== 'dev') return;

  let timestamp = moment();

  let response = {
    timestamp,
    errorMessage: message,
    errorOrigin: origin,
    errorLevel: level
  };

  pino.error(response);
  return response;
};

let info = (message, origin, level = 0) => {
  if (appConfig.env !== 'dev') return;
  
  let timestamp = moment();

  let response = {
    timestamp,
    message,
    origin,
    level
  };

  pino.info(response);
  return response;
};

let log = (message, origin) => {
  if (appConfig.env !== 'dev') return;

  console.log(`${origin ? origin + ': ' : ''}${message}`);
};

module.exports = { error, info, log };