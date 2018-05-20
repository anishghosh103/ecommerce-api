const response = require('./response-template');

module.exports = {

  getNewValue: (oldValue, newValue) => {
    if (newValue) {
      return newValue;
    } else {
      return oldValue;
    }
  },

  processError: (err) => {
    const error = {};

    if (err.custom) {
      error.message = err.message;
      error.status = err.status;
    } else if (err.name === 'ValidationError' || (err.code && err.code === 11000)) {
      error.message = { msg: 'Data Validation Failed. Please Check The Data.' };
      error.status = 422;
    } else {
      error.message = 'Error Occurred.';
      error.status = 500;
    }

    return error;
  },

};