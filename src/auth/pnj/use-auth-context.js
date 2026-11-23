// src/auth/pnj/use-auth-context.js
import { useContext, useMemo } from 'react';
import { AuthContext } from './auth-provider';

export function useAuthContext() {
  return useContext(AuthContext);
}

// Hook chính để check quyền. Trả về object utility `{ has, hasAny, hasAll, permissions }`.
export function usePermission() {
  const { permissions = [] } = useAuthContext();
  return useMemo(() => {
    const set = new Set(permissions);
    const has = (key) => !key || set.has(key);
    const hasAny = (keys) => !keys?.length || keys.some((k) => set.has(k));
    const hasAll = (keys) => !keys?.length || keys.every((k) => set.has(k));
    return { has, hasAny, hasAll, permissions };
  }, [permissions]);
}

// Legacy shortcut — giữ để không break caller cũ (<Can ability="foo" />).
export function useAuthCan(ability) {
  const { has } = usePermission();
  return has(ability);
}
