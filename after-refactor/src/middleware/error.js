const { logger } = require("./logger");
const constants = require('../utils/constants');
//general error handler middleware
const handleError = (err, req, res, next) => {

  logger.log({ level: 'error', message: JSON.stringify(err), });

  const { statusCode, message } = err;

  if (!statusCode) {
    statusCode = constants.HTTP_CODE.INTERNAL_SERVER_ERROR;
    message = "something went wrong!";
  }
  
  const result = {
    error: {
      code: statusCode,
      message: message
    }
  }

  res.status(statusCode).json(result);
};


module.exports = handleError;