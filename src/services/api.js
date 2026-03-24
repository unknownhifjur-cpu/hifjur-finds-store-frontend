import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // optional, if you use cookies
});

// Request interceptor: add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handles errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can log or handle specific error codes here
    // Do NOT use `next` – it's not defined
    if (error.response?.status === 401) {
      // Token expired – redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;