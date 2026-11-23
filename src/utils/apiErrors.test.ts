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

  it('uses the fallback instead of axios developer text or HTML bodies', () => {
    const htmlError = new axios.AxiosError(
      'Request failed with status code 502',
      'ERR_BAD_RESPONSE',
      undefined,
      undefined,
      {
        status: 502,
        statusText: 'Bad Gateway',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: '<html><body>502 Bad Gateway</body></html>',
      }
    );
    const networkError = new axios.AxiosError('Network Error', 'ERR_NETWORK');

    expect(getApiErrorMessage(htmlError, 'Fallback')).toBe('Fallback');
    expect(getApiErrorMessage(networkError, 'Fallback')).toBe('Fallback');
  });
});
