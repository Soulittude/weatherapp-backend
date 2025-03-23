const rateLimit = require('express-rate-limit');

// Limit API calls to 10 requests per minute
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Increase from default 100 to 200 for testing
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = apiLimiter;