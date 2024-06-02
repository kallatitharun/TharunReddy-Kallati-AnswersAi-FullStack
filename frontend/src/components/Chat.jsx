import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import './Chat.css';
import { AuthContext } from '../context/AuthContext';
const socket = io.connect('http://localhost:5001');
/**
 * Component for the chat functionality.
 * Displays messages between the user and the bot.
 * Allows sending and receiving messages in real-time.
 * @returns {JSX.Element} Chat component JSX
 */
const Chat = () => {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState(1000);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    /**
     * Fetches the user ID from the backend.
     * Redirects to the login page if there's an error.
     */
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data._id);
        setTokens(response.data.tokens);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        navigate('/'); // Redirect to login page on error
      }
    };

    /**
     * Fetches chat messages from the backend.
     * Redirects to the login page if there's an error.
     */
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/chat/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        if(response.data[0]){
          setMessages(response.data[0].messages);
        }
        

        console.log(messages);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
        navigate('/'); // Redirect to login page on error
      }
    };

    fetchUserId();
    fetchMessages();

    // Event listeners for receiving messages and handling token errors
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
      
    });

    socket.on('tokenError', (errorMessage) => {
      setError(errorMessage);
    
    });
    socket.on('updateTokens', (data) => {
      setTokens(data.tokens);
    });
    
    

    // Cleanup function to remove event listeners
    return () => {
      socket.off('receiveMessage');
      socket.off('tokenError');
      socket.off('updateTokens');
    };
  }, [token, navigate]);

  /**
   * Scrolls to the bottom of the messages container.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Handles sending a message to the backend via socket.
   */
  async function handleSendMessage() {
    if (input.trim() && tokens >0) {
      const message = { userId, message: input };
      socket.emit('sendMessage', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: input },
      ]);
      setInput('');
      scrollToBottom();
    }else if(tokens<0){
      setError('You need at least 1 token to use the chat');
    }
  }

  return (
    <div className="chat-page">
      <div className="image-container">{/* Image goes here */}</div>
      <div className="chat-container">
        {_.isEmpty(error) ? (
          <>
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.role === 'user' ? 'user-message' : 'bot-message'
                  }
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={tokens < 0}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
            <div className="token-usage">
              Tokens remaining: {tokens}
            </div>
          </>
        ) : (
          <div>{alert(error)}</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
