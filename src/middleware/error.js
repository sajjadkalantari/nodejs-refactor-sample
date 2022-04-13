const { logger } = require("./logger");

//general error handler middleware
const handleError = (err, req, res, next) => {

  logger.log({ level: 'error', message: JSON.stringify(err), });

  const { statusCode, message } = err;

  const result = {
    error: {
      code: statusCode,
      message: message
    }
  }

  res.status(statusCode).json(result);
};


module.exports = handleError;