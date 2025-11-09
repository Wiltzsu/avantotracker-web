import axios, { AxiosInstance } from 'axios';

// Type definitions
interface User {
  id: string;
  email: string;
  name: string;
}

interface UserData {
  email: string;
  password: string;
  name?: string;
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

interface AvantoData {
  date?: string;
  duration?: number;
  temperature?: number;
  notes?: string;
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

interface AvantoListResponse {
  data: AvantoResponse[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AvantoStats {
  total_visits: number;
  total_duration: number;
}

// Define the API response wrapper (what the API actually returns)
interface AvantoStatsResponse {
  data: AvantoStats;
}

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

// Request interceptor: attach Bearer token (if present) to every request.
// Token is stored in localStorage by AuthContext after login
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`, config.data);
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
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🔴 ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
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
  register: async (userData: UserData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/register', userData);
    return response.data;
  },
  
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/api/logout');
    tokenStorage.remove();
  },
  
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/me');
    return response.data;
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
  
  create: async (data: AvantoData): Promise<AvantoResponse> => {
    const response = await apiClient.post<AvantoResponse>('/api/v1/avanto', data);
    return response.data;
  },
  
  getById: async (id: string | number): Promise<AvantoResponse> => {
    const response = await apiClient.get<AvantoResponse>(`/api/v1/avanto/${id}`);
    return response.data;
  },
  
  update: async (id: string | number, data: Partial<AvantoData>): Promise<AvantoResponse> => {
    const response = await apiClient.put<AvantoResponse>(`/api/v1/avanto/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/v1/avanto/${id}`);
  },

  stats: async (): Promise<AvantoStats> => {
    const response = await apiClient.get<AvantoStatsResponse>(`/api/v1/stats`);
    return response.data.data;
  }
};

export default apiClient;