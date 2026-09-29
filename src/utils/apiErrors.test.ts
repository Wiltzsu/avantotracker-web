import { describe, expect, it } from 'vitest';
import axios from 'axios';
import { getApiErrorMessage } from './apiErrors';

describe('getApiErrorMessage', () => {
  it('returns API message from axios errors', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Invalid credentials' },
      }
    );

    expect(getApiErrorMessage(error)).toBe('Invalid credentials');
  });

  it('returns first validation error when message is missing', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { password: ['The password must be at least 8 characters.'] },
      }
    );

    expect(getApiErrorMessage(error)).toBe('The password must be at least 8 characters.');
  });

  it('falls back when error shape is unknown', () => {
    expect(getApiErrorMessage(new Error('network down'), 'Fallback')).toBe('network down');
    expect(getApiErrorMessage({}, 'Fallback')).toBe('Fallback');
  });
});
