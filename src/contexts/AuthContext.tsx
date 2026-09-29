import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, setAuthErrorHandler } from '../services/api';
import {
  setAuthToken,
  clearAuth,
  setUserData,
  hasStoredSession,
  User,
} from '../utils/auth';
import { getApiErrorMessage } from '../utils/apiErrors';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSessionExpired = useCallback(() => {
    clearAuth();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    setAuthErrorHandler(handleSessionExpired);
  }, [handleSessionExpired]);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!hasStoredSession()) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('auth_token');
      setAuthToken(token);

      try {
        const userData = await authAPI.me();
        if (!cancelled) {
          setUserData(userData);
          setUser(userData);
        }
      } catch {
        if (!cancelled) {
          clearAuth();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(credentials);
      const { user: userData, token } = response;

      setAuthToken(token);
      setUserData(userData);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Login failed. Please try again.');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
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
      const errorMessage = getApiErrorMessage(err, 'Registration failed. Please try again.');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      setUser(null);
    }
  };

  const value: AuthContextValue = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
