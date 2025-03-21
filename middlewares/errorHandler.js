const createError = require('http-errors');

// Handle 404 Not Found
const notFound = (req, res, next) => {
    next(createError(404, 'Resource not found'));
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error',
        },
    });
};

module.exports = { notFound, errorHandler };