const Chat = require('../models/Chat');
const axios = require('axios');
const User = require('../models/User');

/**
 * Controller function to retrieve messages for the authenticated user.
 * @param {Object} req - Express request object with user ID
 * @param {Object} res - Express response object
 * @returns {Object} Response JSON object containing messages
 */
exports.getMessages = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id });
    console.log(chats);
    return res.status(200).json(chats);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Controller function to send a message from the authenticated user to the bot.
 * @param {Object} req - Express request object with user ID and message body
 * @param {Object} res - Express response object
 * @returns {Object} Response JSON object containing bot response
 */
exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.tokens <= 0) {
      return res.status(403).json({ error: 'Token limit reached' });
    }

    const chat = await Chat.findOne({ userId: req.user.id });
    chat.messages.push({ role: 'user', content: message });
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: message,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const botMessage = response.data.choices[0].text.trim();
    chat.messages.push({ role: 'bot', content: botMessage });
    await chat.save();

    user.tokens -= response.data.usage.total_tokens;
    await user.save();

    return res.status(200).json({ message: botMessage });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
