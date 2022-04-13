const { logger } = require("./logger");

class ClientError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {

    logger.log({
        level: 'error',
        message: JSON.stringify(err),
    });

    const { statusCode, message } = err;

    const result = {
        error: {
            code: statusCode,
            message: message
        }
    }

    res.status(statusCode).json(result);
};

module.exports = {
    ClientError,
    handleError
}