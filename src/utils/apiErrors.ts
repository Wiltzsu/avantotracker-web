import { isAxiosError } from 'axios';

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;

      if (typeof record.message === 'string' && record.message.trim()) {
        return record.message;
      }

      const firstFieldError = Object.values(record).find(
        (value) => Array.isArray(value) && typeof value[0] === 'string'
      );

      if (Array.isArray(firstFieldError) && typeof firstFieldError[0] === 'string') {
        return firstFieldError[0];
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
