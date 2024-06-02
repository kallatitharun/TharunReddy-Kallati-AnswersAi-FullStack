const { sendMessage } = require('../controllers/chatController');
const Chat = require('../models/Chat');
const User = require('../models/User');
const axios = require('axios');

jest.mock('../models/Chat');
jest.mock('../models/User');
jest.mock('axios');

describe('Chat Controller - sendMessage', () => {
  it('should send a message to the bot and update chat and user', async () => {
    const req = { user: { id: 'user_id' }, body: { message: 'Hello, bot!' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const chatMock = { messages: [], save: jest.fn() };
    const userMock = { tokens: 100, save: jest.fn() };
    const axiosResponse = {
      data: {
        choices: [{ text: 'Bot response' }],
        usage: { total_tokens: 50 },
      },
    };

    Chat.findOne.mockResolvedValueOnce(chatMock);
    User.findById.mockResolvedValueOnce(userMock);
    axios.post.mockResolvedValueOnce(axiosResponse);

    await sendMessage(req, res);

    expect(chatMock.messages).toEqual([
      { role: 'user', content: 'Hello, bot!' },
      { role: 'bot', content: 'Bot response' },
    ]);
    expect(chatMock.save).toHaveBeenCalled();
    expect(userMock.tokens).toBe(50);
    expect(userMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bot response' });
  });
});
