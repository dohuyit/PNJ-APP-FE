// src/auth/pnj/use-auth-login.js — login admin.
// shortcut: mock mode trước. Nếu credentials match MOCK_TEST_USERS → set mock token.
// Nếu không match + có BE → thử POST /auth/login. Upgrade bỏ mock khi BE ổn định.
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-provider';
import { authEndpoints, tokenStorage } from './auth-config';
import { findMockUser, makeMockToken } from 'src/mock-data/mock-auth-users';

const MOCK_ENABLED = (process.env.NEXT_PUBLIC_MOCK_AUTH ?? '1') === '1';

export function useAuthLogin() {
  const { refresh } = useContext(AuthContext);

  return async ({ email, password }) => {
    if (MOCK_ENABLED) {
      const user = findMockUser(email, password);
      if (user) {
        tokenStorage.set(makeMockToken(user.id));
        await refresh();
        return { user };
      }
      // Nếu không match + không có BE URL thật → báo sai mật khẩu ngay
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('Sai email hoặc mật khẩu · dùng danh sách tài khoản thử bên dưới');
      }
    }

    const res = await axios.post(authEndpoints.login, { email, password });
    const token = res.data?.data?.token;
    if (!token) throw new Error('Không nhận được token từ máy chủ');
    tokenStorage.set(token);
    await refresh();
    return res.data?.data;
  };
}
