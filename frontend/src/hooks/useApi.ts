import axios from 'axios';
import { useCallback } from 'react';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const get = useCallback(async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get(url, { params });
    return response.data;
  }, []);

  const post = useCallback(async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post(url, data);
    return response.data;
  }, []);

  const put = useCallback(async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put(url, data);
    return response.data;
  }, []);

  const del = useCallback(async <T>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
  };
}; 