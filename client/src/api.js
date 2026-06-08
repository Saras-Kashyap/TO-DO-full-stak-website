import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'https://to-do-full-stak-website.onrender.com/api';

// Normalize URL: remove any trailing slash
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

// Automatically append /api if it is missing
if (!baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
});

// Request interceptor to attach JWT token to headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (like expired/invalid tokens)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage token
      localStorage.removeItem('token');
      
      // Reload page to reset application state back to login view
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
