// src/auth/pnj/use-auth-logout.js
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-provider';
import { authEndpoints, tokenStorage } from './auth-config';

export function useAuthLogout() {
  const { clear } = useContext(AuthContext);

  return async () => {
    const token = tokenStorage.get();
    if (token) {
      try {
        await axios.post(authEndpoints.logout, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        /* ignore network/401 on logout */
      }
    }
    clear();
  };
}
