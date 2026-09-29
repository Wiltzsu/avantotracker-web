import axios from 'axios';

export interface User {
  id: number | string;
  email: string;
  name: string;
}

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
};

export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);

export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? (JSON.parse(userData) as User) : null;
};

export const setUserData = (userData: User): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  delete axios.defaults.headers.common.Authorization;
};

export const hasStoredSession = (): boolean => {
  return Boolean(getAuthToken());
};
