const mongoose = require('mongoose');

/**
 * Schema for representing chat messages.
 */
const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // User ID associated with the chat
    messages: [
      // Array of messages in the chat
      {
        role: { type: String, enum: ['user', 'assistant'], required: true }, // Role of the message sender (user or assistant)
        content: { type: String, required: true }, // Content of the message
      },
    ],
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

module.exports = mongoose.model('Chat', ChatSchema);
