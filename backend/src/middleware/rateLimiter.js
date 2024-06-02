const setRateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware to restrict the number of requests per minute.
 * @type {Object}
 */
const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Maximum number of requests per windowMs
  message: 'You have exceeded your 5 requests per minute limit.', // Error message for exceeding limit
  headers: true, // Include rate limit headers in the response
});

module.exports = rateLimitMiddleware;
