'use client';

import axios from 'axios';

import { CONFIG, PNJ_API } from 'src/global-config';

// MOCK mode → KHÔNG auto-redirect về login khi 401 (vì BE không có / mock mode).
const MOCK_AUTH = (process.env.NEXT_PUBLIC_MOCK_AUTH ?? '1') === '1';

const axiosInstance = axios.create({ baseURL: CONFIG.apiUrl });

// Attach Bearer token (admin) từ localStorage mỗi request. Landing public bỏ qua header này.
axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(PNJ_API.tokenKey);
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 → clear token + redirect về login admin (chỉ khi KHÔNG mock mode).
        if (!MOCK_AUTH && error?.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem(PNJ_API.tokenKey);
            if (window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
    }
);

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.withXSRFToken = true;

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
    try {
        const [url, config] = Array.isArray(args) ? args : [args];
        const res = await axiosInstance.get(url, { ...config });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch:', error);
        throw error;
    }
};
