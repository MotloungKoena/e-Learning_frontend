import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'exists' : 'not found'); // log for debugging
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header'); // Debug log
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Added response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;