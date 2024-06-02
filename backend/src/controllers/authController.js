const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Controller function to register a new user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response JSON object
 */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Controller function to authenticate and login a user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response JSON object containing JWT token
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Controller function to get the authenticated user profile.
 * @param {Object} req - Express request object with user ID
 * @param {Object} res - Express response object
 * @returns {Object} Response JSON object containing user profile
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
