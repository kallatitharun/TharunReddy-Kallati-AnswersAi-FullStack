const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authmiddleware');

/**
 * Router for handling authentication related routes.
 */
const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for fetching user details
router.get('/me', authenticate, getMe);

module.exports = router;
