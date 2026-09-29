import { describe, expect, it } from 'vitest';
import {
  clearAuth,
  getAuthToken,
  getUserData,
  hasStoredSession,
  setAuthToken,
  setUserData,
} from './auth';

describe('auth storage helpers', () => {
  it('stores and clears auth token', () => {
    setAuthToken('token-123');
    expect(getAuthToken()).toBe('token-123');

    clearAuth();
    expect(getAuthToken()).toBeNull();
  });

  it('stores and reads user data', () => {
    const user = { id: 1, email: 'test@example.com', name: 'Test User' };
    setUserData(user);
    expect(getUserData()).toEqual(user);
  });

  it('detects stored sessions by token presence', () => {
    expect(hasStoredSession()).toBe(false);
    setAuthToken('token-123');
    expect(hasStoredSession()).toBe(true);
  });
});
