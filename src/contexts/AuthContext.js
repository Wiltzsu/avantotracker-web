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
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response;
      
      setAuthToken(token);
      setUserData(userData);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      // Detailed error categorization
      let errorMessage = 'Login failed. Please try again.';
      let errorType = 'unknown';
      
      if (err.response) {
        // Server responded with error status
        errorType = 'server_error';
        errorMessage = err.response?.data?.message || `Server error (${err.response.status})`;
      } else if (err.request) {
        // Request was made but no response received
        errorType = 'network_error';
        errorMessage = 'Network error. Check your connection.';
      } else {
        // Something else happened
        errorType = 'client_error';
        errorMessage = err.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
      
      // Return detailed error info
      return { 
        success: false, 
        error: errorMessage,
        errorType: errorType,
        statusCode: err.response?.status,
        fullError: {
          hasResponse: !!err.response,
          hasRequest: !!err.request,
          message: err.message,
          responseData: err.response?.data,
          code: err.code
        }
      };
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response;
      
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
