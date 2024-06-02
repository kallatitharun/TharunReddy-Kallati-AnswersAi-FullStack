const { authenticate } = require('./authmiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('Authentication Middleware - authenticate', () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn() };
    res = { status: jest.fn(), json: jest.fn() };
    next = jest.fn();
  });

  test('should call next if token is valid', async () => {
    req.header.mockReturnValueOnce('Bearer valid_token');
    jwt.verify.mockReturnValueOnce({ id: 'user_id' });
    User.findById.mockResolvedValueOnce({});

    await authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(User.findById).toHaveBeenCalledWith('user_id');
    expect(next).toHaveBeenCalled();
  });
});
