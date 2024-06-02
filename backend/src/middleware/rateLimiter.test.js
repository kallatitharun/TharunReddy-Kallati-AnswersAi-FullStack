// Import the required modules
const setRateLimit = require('express-rate-limit');

// Import the rate limit middleware
const rateLimitMiddleware = require('./rateLimiter');

// Mock the express-rate-limit module
jest.mock('express-rate-limit');

describe('Rate Limit Middleware', () => {
  it('should be configured with correct options', () => {
    // Assert that setRateLimit is called with the correct options
    expect(setRateLimit).toHaveBeenCalledWith({
      windowMs: 60000, // 1 minute in milliseconds
      max: 15, // Maximum number of requests per minute
      message: 'You have exceeded your 5 requests per minute limit.', // Error message for exceeding limit
      headers: true, // Include rate limit headers in the response
    });

    // Assert that the rate limit middleware is returned
    expect(rateLimitMiddleware).toEqual(setRateLimit());
  });
});
