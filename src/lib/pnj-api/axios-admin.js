// src/lib/pnj-api/axios-admin.js — single admin axios instance + 401 redirect
import axios from 'axios';
import { PNJ_API } from 'src/global-config';
import { tokenStorage } from 'src/auth/pnj/auth-config';

const MOCK_AUTH = (process.env.NEXT_PUBLIC_MOCK_AUTH ?? '1') === '1';

export const axiosAdmin = axios.create({ baseURL: PNJ_API.baseUrl });

axiosAdmin.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosAdmin.interceptors.response.use(
  (res) => res,
  (err) => {
    // Chỉ auto-logout khi KHÔNG mock mode (mock BE không có → tránh loop).
    if (!MOCK_AUTH && err?.response?.status === 401 && typeof window !== 'undefined') {
      tokenStorage.clear();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);
