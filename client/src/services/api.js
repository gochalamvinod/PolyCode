import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to format error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const message = errorData?.message || error.message || 'An unexpected network error occurred';
    const code = errorData?.error?.code || 'UNKNOWN_ERROR';
    const details = errorData?.error?.details || null;

    return Promise.reject({
      message,
      code,
      details,
      status: error.response?.status
    });
  }
);
