import { isAxiosError } from 'axios';

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Jokin meni pieleen. Yritä uudelleen.'
): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    // Skip HTML bodies (e.g. an nginx 502 page) so markup never reaches the UI
    if (typeof data === 'string' && data.trim() && !data.trim().startsWith('<')) {
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

    // Axios' own message ("Request failed with status code 500", "Network Error")
    // is English developer text; show the Finnish fallback instead.
    return fallback;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
