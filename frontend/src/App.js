import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import InitialPage from './components/InitialPage';
import AuthProvider from './context/AuthContext';
import Logout from './components/Logout';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <div>
          <Logout /> {/* Add logout button in a common place, like a header */}
      </div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<InitialPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
