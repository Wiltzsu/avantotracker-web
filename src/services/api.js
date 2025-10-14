import axios from 'axios';

// Base URL for the backend API, injected at build time
const API_BASE = process.env.REACT_APP_API_URL;

// Create axios instance for all API calls
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token (if present) to every request.
// Token is stored in localStorage by AuthContext after login
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle global auth failures.
// If the server returns 401 (expired/invalid token), clear local session and go to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API: functions called by AuthContext to hit backend endpoints
export const authAPI = {
  register: (userData) => apiClient.post('/register', userData),
  login: (credentials) => apiClient.post('/login', credentials),
  logout: () => apiClient.post('/logout'),
  me: () => apiClient.get('/me')
};

// Avanto API: CRUD endpoints for avanto resources
export const avantoAPI = {
  getAll: () => apiClient.get('/v1/avanto'),
  create: (data) => apiClient.post('/v1/avanto', data),
  getById: (id) => apiClient.get(`/v1/avanto/${id}`),
  update: (id, data) => apiClient.put(`/v1/avanto/${id}`, data),
  delete: (id) => apiClient.delete(`/v1/avanto/${id}`),
  getUserAvantos: (userId) => apiClient.get(`/v1/avanto/user/${userId}`)
};

export default apiClient;
