import axios, { AxiosInstance } from 'axios';
import type { AvantoPayload } from '../utils/avantoForm';

// Type definitions
interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

interface AvantoMutationResponse {
  data: AvantoResponse;
  message?: string;
}

interface MeResponse {
  user: User;
}

export interface AvantoResponse {
  avanto_id: string | number;
  user_id: string | number;
  date: string;
  location: string;
  water_temperature: number | null;
  feeling_before: number | null;
  feeling_after: number | null;
  sauna: boolean | null;
  sauna_duration: number | null;
  swear_words: number | null;
  air_temperature?: number | null;
  duration_minutes?: number;
  duration_seconds?: number;
}

interface AvantoResponseItem {
  data: AvantoResponse;
}

interface AvantoListResponse {
  data: AvantoResponse[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface MonthlyVisit {
  month: string;
  count: number;
}

export interface LocationBreakdownItem {
  location: string;
  visits: number;
}

export interface SaunaBreakdown {
  with_sauna: number;
  without_sauna: number;
}

export interface AvantoStats {
  total_visits: number;
  total_duration: number;
  average_duration: number;
  longest_duration: number;
  average_water_temperature: number | null;
  coldest_water_temperature: number | null;
  total_swear_words: number;
  total_sauna_sessions: number;
  total_sauna_duration: number;
  average_mood_improvement: number | null;
  favorite_location: string | null;
  this_week_visits: number;
  this_month_visits: number;
  current_streak_days: number;
  best_streak_days: number;
  visits_by_month: MonthlyVisit[];
  location_breakdown: LocationBreakdownItem[];
  sauna_breakdown: SaunaBreakdown;
  achievements: Achievement[];
  period: {
    start_date: string | null;
    end_date: string | null;
  };
}

export interface DashboardSnapshot {
  label: string;
  visits: number;
  total_duration: number;
  average_duration: number;
  sauna_sessions: number;
  average_water_temperature: number | null;
}

export interface DashboardHighlights {
  coldest_water_temperature: number | null;
  longest_duration: number;
  total_swear_words: number;
  favorite_location: string | null;
  average_mood_improvement: number | null;
}

export interface DashboardData {
  monthly_snapshot: DashboardSnapshot;
  days_since_last_dip: number | null;
  last_dip_date: string | null;
  current_streak_days: number;
  best_streak_days: number;
  recent_avantos: AvantoResponse[];
  highlights: DashboardHighlights;
}

interface AvantoStatsResponse {
  data: AvantoStats;
}

interface DashboardResponse {
  data: DashboardData;
}

export type StatsRange = 'all' | 'month' | '6months' | 'year';

// Base URL for the backend API, injected at build time
const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  if (import.meta.env.MODE === 'production') {
    throw new Error('VITE_API_URL must be defined in production');
  } else {
    console.warn('VITE_API_URL is not defined. API calls will fail.');
  }
}

// Auth error handler
type AuthErrorCallback = () => void;
let authErrorCallback: AuthErrorCallback | null = null;

export const setAuthErrorHandler = (callback: AuthErrorCallback) => {
  authErrorCallback = callback;
};

// Token storage utilities
export const tokenStorage = {
  get: (): string | null => localStorage.getItem('auth_token'),
  set: (token: string): void => localStorage.setItem('auth_token', token),
  remove: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
};

// Create axios instance for all API calls
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const SENSITIVE_AUTH_PATHS = ['/api/login'];

const isSensitiveAuthRequest = (url?: string): boolean =>
  SENSITIVE_AUTH_PATHS.some((path) => url?.includes(path));

// Request interceptor: attach Bearer token (if present) to every request.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      const payload = isSensitiveAuthRequest(config.url) ? '[redacted]' : config.data;
      console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`, payload);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle global auth failures.
// If the server returns 401 (expired/invalid token), clear local session and go to login

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const payload = isSensitiveAuthRequest(response.config.url) ? '[redacted]' : response.data;
      console.log(`🟢 ${response.config.method?.toUpperCase()} ${response.config.url}`, payload);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      const payload = isSensitiveAuthRequest(error.config?.url) ? '[redacted]' : error.response?.data;
      console.error(`🔴 ${error.config?.method?.toUpperCase()} ${error.config?.url}`, payload);
    }

    // Handle unauthorized errors
    if (error.response?.status === 401) {
      tokenStorage.remove();
      
      if (authErrorCallback) {
        authErrorCallback();
      } else {
        // Fallback if no handler is registered
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/api/logout');
    tokenStorage.remove();
  },
  
  me: async (): Promise<User> => {
    const response = await apiClient.get<MeResponse>('/api/me');
    return response.data.user;
  }
};

// Avanto API
export const avantoAPI = {
  getAll: async (page?: number, perPage?: number): Promise<AvantoListResponse> => {
    const response = await apiClient.get<AvantoListResponse>('/api/v1/avanto', {
      params: { page, per_page: perPage }
    });
    return response.data;
  },
  
  create: async (data: AvantoPayload): Promise<AvantoResponse> => {
    const response = await apiClient.post<AvantoMutationResponse>('/api/v1/avanto', data);
    return response.data.data;
  },
  
  getById: async (id: string | number): Promise<AvantoResponse> => {
    const response = await apiClient.get<AvantoResponseItem>(`/api/v1/avanto/${id}`);
    return response.data.data;
  },
  
  update: async (id: string | number, data: Partial<AvantoPayload>): Promise<AvantoResponse> => {
    const response = await apiClient.put<AvantoMutationResponse>(`/api/v1/avanto/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/api/v1/avanto/${id}`);
  },

  stats: async (range: StatsRange = 'all'): Promise<AvantoStats> => {
    const response = await apiClient.get<AvantoStatsResponse>('/api/v1/stats', {
      params: range === 'all' ? undefined : { range },
    });
    return response.data.data;
  },

  dashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardResponse>('/api/v1/dashboard');
    return response.data.data;
  },
};

export default apiClient;