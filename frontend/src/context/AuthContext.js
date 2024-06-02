import React, { createContext, useState, useEffect } from 'react';

/**
 * Context provider component for managing authentication state.
 * Stores and updates the user authentication token in local storage.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 * @returns {JSX.Element} AuthProvider component JSX
 */
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    /**
     * Updates the token in local storage whenever it changes.
     */
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  /**
   * Function to update the authentication token.
   * @param {string} newToken - New authentication token
   */
  const setAuth = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };



  return (
    <AuthContext.Provider value={{ token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
