import axios from 'axios';

const API_ORIGIN = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = API_ORIGIN
  ? `${API_ORIGIN.replace(/\/+$/, '')}/api/v1`
  : import.meta.env.DEV
    ? '/api/v1'
    : undefined;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      return Promise.reject(
        new Error('VITE_API_URL must be configured for the production frontend.')
      );
    }

    const token = localStorage.getItem('restaurantiq_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 expired sessions
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on public / customer ordering pages
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        !currentPath.includes('/order') &&
        currentPath !== '/'
      ) {
        localStorage.removeItem('restaurantiq_token');
        localStorage.removeItem('restaurantiq_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
