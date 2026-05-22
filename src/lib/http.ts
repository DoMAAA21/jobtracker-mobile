import { API_URL } from '@/config/config';
import axios from 'axios';

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
