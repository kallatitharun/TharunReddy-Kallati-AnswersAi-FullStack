const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { authenticate } = require('../middleware/authmiddleware');

/**
 * Router for handling chat-related routes.
 */
const router = express.Router();

// Route for fetching messages
router.get('/messages', authenticate, getMessages);

// Route for sending messages
router.post('/send', authenticate, sendMessage);

module.exports = router;
