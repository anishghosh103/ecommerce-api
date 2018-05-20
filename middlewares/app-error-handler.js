
const logger = require('../libs/logger');
const responseTemplate = require('../libs/response-template');

let errorHandler = (err, req, res, next) => {
  logger.log(err, 'AppErrorHandler.ErrorHandler called');

  let apiResponse = responseTemplate.generate(
    true,
    'Some error occurred at global level',
    500,
    null
  );

  res.json(apiResponse);
};

let notFoundHandler = (req, res, next) => {
  logger.log('Route Not Found!', 'AppErrorHandler.NotFoundHandler');

  let apiResponse = responseTemplate.generate(
    true,
    "Route not found in the API",
    404,
    null
  );

  res.status(404).json(apiResponse);
};

module.exports = { errorHandler, notFoundHandler };