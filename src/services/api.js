import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
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

// Auth service
export const authAPI = {
  register: (userData) => apiClient.post('/register', userData),
  login: (credentials) => apiClient.post('/login', credentials),
  logout: () => apiClient.post('/logout'),
  me: () => apiClient.get('/me')
};

// Avanto service  
export const avantoAPI = {
  getAll: () => apiClient.get('/v1/avanto'),
  create: (data) => apiClient.post('/v1/avanto', data),
  getById: (id) => apiClient.get(`/v1/avanto/${id}`),
  update: (id, data) => apiClient.put(`/v1/avanto/${id}`, data),
  delete: (id) => apiClient.delete(`/v1/avanto/${id}`),
  getUserAvantos: (userId) => apiClient.get(`/v1/avanto/user/${userId}`)
};

export default apiClient;
