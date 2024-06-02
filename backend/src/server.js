require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const User = require('./models/User');
const Chat = require('./models/Chat');
const axios = require('axios');
const rateLimitMiddleware = require('./middleware/rateLimiter');

// Initialize the express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(
  cors({
    origin: 'http://host.docker.internal:3000/',
    // origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.use(rateLimitMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


  const resetTokens = async () => {
    try {
      await User.updateMany({}, { tokens: 1000, lastReset: Date.now() });
      console.log('Tokens reset to 1000 for all users');
    } catch (err) {
      console.error('Error resetting tokens:', err);
    }
  };
  
  // Schedule the cron job to run at midnight every day
  cron.schedule('0 0 * * *', resetTokens);

// Socket.io event listeners
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (data) => {
    const { userId, message } = data;

    // Check token availability
    const user = await User.findById(userId);
    if (!user || user.tokens <= 0) {
      socket.emit('tokenError', 'You need at least 1000 tokens to use the chat');
      return;
    }

    // Find or create chat
    let chat = await Chat.findOne({ userId: userId });
    if (!chat) {
      chat = new Chat({
        userId: userId,
        messages: [{ role: 'user', content: message }],
      });
    } else {
      chat.messages.push({ role: 'user', content: message });
    }

    // Call OpenAI API to get bot response
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: chat.messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Update chat messages with bot response
    const botMessage = response.data.choices[0].message.content;
    chat.messages.push({ role: 'assistant', content: botMessage });
    await chat.save();

    // Update user tokens and emit bot response to client
    user.tokens -= response.data.usage.total_tokens;
    await user.save();
    io.to(socket.id).emit('receiveMessage', {
      role: 'assistant',
      content: botMessage,
    });
    io.to(socket.id).emit('updateTokens', {
      tokens: user.tokens,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// module.exports=router

// {
//   "id": "chatcmpl-123",
//   "object": "chat.completion",
//   "created": 1677652288,
//   "model": "gpt-3.5-turbo-0125",
//   "system_fingerprint": "fp_44709d6fcb",
//   "choices": [{
//     "index": 0,
//     "message": {
//       "role": "assistant",
//       "content": "\n\nHello there, how may I assist you today?",
//     },
//     "logprobs": null,
//     "finish_reason": "stop"
//   }],
//   "usage": {
//     "prompt_tokens": 9,
//     "completion_tokens": 12,
//     "total_tokens": 21
//   }
// }
