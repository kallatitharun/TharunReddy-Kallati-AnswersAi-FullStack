import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InitialPage.css';

/**
 * Component for the initial landing page.
 * Provides options for users to either login or register.
 * @returns {JSX.Element} InitialPage component JSX
 */
const InitialPage = () => {
  const navigate = useNavigate();

  /**
   * Navigates to the login page.
   */
  const handleLoginClick = () => {
    navigate('/login');
  };

  /**
   * Navigates to the register page.
   */
  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="auth-form">
      <h2>Welcome to ChatGPT</h2>
      <h2>Login or register</h2>
      <div className="button-group">
        <button className="auth-button" onClick={handleLoginClick}>
          Login
        </button>
        <button className="auth-button" onClick={handleRegisterClick}>
          Register
        </button>
      </div>
    </div>
  );
};

export default InitialPage;
