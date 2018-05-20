
const utils = require('./utils');

/**
 * Generate Response
 * @param {boolean} error 
 * @param {string} message Details of the response
 * @param {number} status Valid HTTP Response Code
 * @param {any} data Response Data
 */
let generate = (error, message, status, data) => {
  return { error, message, status, data };
};

let error = (error, status) => {
  let err = {};

  if (status === undefined) {
    err = utils.processError(error);
  } else {
    err.message = error;
    err.status = status;
  }
  
  return generate(true, err.message, err.status, null);
};

module.exports = { generate, error };