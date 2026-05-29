import { API_URL } from '@/config/config';
import { clearAccessToken, getAccessToken } from '@/lib/auth-token';
import axios from 'axios';

export const http = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearAccessToken();
    }
    return Promise.reject(error);
  },
);
