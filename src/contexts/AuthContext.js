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
      
      console.log('🔵 Login attempt:', { email: credentials.email });
      
      const response = await authAPI.login(credentials);
      
      console.log('🟢 Login response:', response);
      
      const { user: userData, token } = response;
      
      console.log('🟢 Extracted data:', { user: userData, token: token ? 'exists' : 'missing' });
      
      setAuthToken(token);
      setUserData(userData);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      // More detailed error logging
      console.error('🔴 Login error:', err);
      console.error('🔴 Error response:', err.response);
      console.error('🔴 Error data:', err.response?.data);
      console.error('🔴 Error status:', err.response?.status);
      console.error('🔴 Error headers:', err.response?.headers);
      
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      // Return more detailed error info
      return { 
        success: false, 
        error: errorMessage,
        statusCode: err.response?.status,
        fullError: err.response?.data
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
