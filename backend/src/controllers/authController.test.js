const { register } = require('../controllers/authController');
const User = require('../models/User');

jest.mock('../models/User');

describe('Auth Controller - register', () => {
  it('should register a new user successfully', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.mockReturnValueOnce({ save: jest.fn() });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
    });
  });
});
