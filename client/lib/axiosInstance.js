import axios from 'axios';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        const token = Cookies.get('token');

        try {
          const decoded = JSON.parse(localStorage.getItem('penguji'))
          const role = decoded.role;

          if (role === 'admin') {
            window.location.href = '/admin/login';
          } else if (role === 'penguji ranting' || role === 'penguji cabang') {
            window.location.href = '/penguji/login';
          } else if (role === 'pengurus') {
            window.location.href = '/pengurus/login';
          } else {
            window.location.href = '/';
          }
        } catch (e) {
          console.error('Failed to decode token:', e);
          window.location.href = '/login';
        }

        toast.error('Token expired or invalid. Please login again.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
