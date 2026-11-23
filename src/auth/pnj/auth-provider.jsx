// src/auth/pnj/auth-provider.jsx — admin auth context + bootstrap /auth/me
// shortcut: BE chưa ready → MOCK_ENABLED dùng mock-auth-users. Upgrade bỏ mock khi BE ổn.
'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { authEndpoints, tokenStorage } from './auth-config';
import { ALL_PERMISSION_KEYS, SYSTEM_ROLES } from 'src/constants/permissions';
import { parseMockToken, MOCK_TEST_USERS } from 'src/mock-data/mock-auth-users';

const MOCK_ENABLED = (process.env.NEXT_PUBLIC_MOCK_AUTH ?? '1') === '1';

// Fallback mặc định khi không có token (dev convenience).
const DEFAULT_MOCK_USER = MOCK_TEST_USERS[0]; // super admin

function computePermissionsForUser(user) {
  if (!user?.role_keys?.length) return [];
  if (user.role_keys.includes('super_admin')) return ALL_PERMISSION_KEYS;
  const set = new Set();
  user.role_keys.forEach((rk) => {
    const role = SYSTEM_ROLES.find((r) => r.key === rk);
    role?.permission_keys?.forEach((pk) => set.add(pk));
  });
  return Array.from(set);
}

export const AuthContext = createContext({
  user: null,
  loading: true,
  permissions: [],
  refresh: () => {},
  clear: () => {},
});

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, permissions: [], loading: true });

  const refresh = useCallback(async () => {
    const token = tokenStorage.get();

    // Case 1: mock token → lookup user từ MOCK_TEST_USERS.
    if (MOCK_ENABLED && token) {
      const mockUser = parseMockToken(token);
      if (mockUser) {
        setState({
          user: mockUser,
          permissions: computePermissionsForUser(mockUser),
          loading: false,
        });
        return;
      }
    }

    // Case 2: không token → fallback mock super admin (dev tiện).
    if (!token) {
      if (MOCK_ENABLED) {
        setState({
          user: DEFAULT_MOCK_USER,
          permissions: computePermissionsForUser(DEFAULT_MOCK_USER),
          loading: false,
        });
      } else {
        setState({ user: null, permissions: [], loading: false });
      }
      return;
    }

    // MOCK mode + token lạ (không parse được) → coi như invalid, clear + fallback mock.
    if (MOCK_ENABLED) {
      tokenStorage.clear();
      setState({
        user: DEFAULT_MOCK_USER,
        permissions: computePermissionsForUser(DEFAULT_MOCK_USER),
        loading: false,
      });
      return;
    }

    // Case 3: token thật → gọi BE.
    try {
      const res = await axios.get(authEndpoints.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState({
        user: res.data?.data?.user ?? res.data?.data ?? null,
        permissions: res.data?.data?.permissions ?? [],
        loading: false,
      });
    } catch {
      tokenStorage.clear();
      if (MOCK_ENABLED) {
        setState({
          user: DEFAULT_MOCK_USER,
          permissions: computePermissionsForUser(DEFAULT_MOCK_USER),
          loading: false,
        });
      } else {
        setState({ user: null, permissions: [], loading: false });
      }
    }
  }, []);

  const clear = useCallback(() => {
    tokenStorage.clear();
    setState({ user: null, permissions: [], loading: false });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ ...state, refresh, clear }), [state, refresh, clear]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
