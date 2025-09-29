import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { setAuthToken, clearAuth, getUserData, setUserData, isAuthenticated } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const userData = getUserData();
      setUser(userData);
      setAuthToken(localStorage.getItem('auth_token'));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Set loading state to true - this shows the spinner/loading UI
      setLoading(true);

      // Clear any previous error messages
      setError(null);
      
      // Send login request to API with user credentials (api.js)
      // credentials = { email: "john@example.com", password: "password123" }
      const response = await authAPI.login(credentials);

      // Extract user data and token from API response
      // response.data = { user: {...}, token: "abc123", message: "Login successful" }
      const { user: userData, token } = response.data;
      
      // Save the authentication token to localStorage and axios headers
      // This allows future API requests to include the token
      setAuthToken(token);

      // Save user data to localStorage for persistence
      // User stays logged in even if they refresh the page
      setUserData(userData);

      // Update the user state in React context
      // This riggers re-render of components that use useAuth()
      setUser(userData);
      
      // Return success result to Login component
      // Login component uses this to decide whether to redirect
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data;
      
      setAuthToken(token);
      setUserData(newUser);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
