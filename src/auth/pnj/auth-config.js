// src/auth/pnj/auth-config.js — PNJ auth endpoints + token storage helpers
import { PNJ_API } from 'src/global-config';

export const authEndpoints = {
  login: `${PNJ_API.baseUrl}/auth/login`,
  logout: `${PNJ_API.baseUrl}/auth/logout`,
  me: `${PNJ_API.baseUrl}/auth/me`,
};

export const tokenStorage = {
  get: () => (typeof window === 'undefined' ? null : localStorage.getItem(PNJ_API.tokenKey)),
  set: (t) => localStorage.setItem(PNJ_API.tokenKey, t),
  clear: () => localStorage.removeItem(PNJ_API.tokenKey),
};
