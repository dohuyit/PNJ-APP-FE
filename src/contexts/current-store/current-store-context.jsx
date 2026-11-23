// src/contexts/current-store/current-store-context.jsx
// Context quản lý "cửa hàng đang xem" cho admin dashboard.
// - ALL_STORES sentinel = null cho currentStoreId (nghĩa là cross-store)
// - persist localStorage key ADMIN_CURRENT_STORE_ID
// - availableStores = filter từ user.accessible_store_ids (hoặc toàn bộ nếu 'all')

'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { mockStores } from 'src/mock-data/stores';
import { useAuthContext, usePermission } from 'src/auth/pnj/use-auth-context';

const STORAGE_KEY = 'ADMIN_CURRENT_STORE_ID';
export const ALL_STORES = null;

const CurrentStoreContext = createContext({
  currentStoreId: ALL_STORES,
  currentStore: null,
  availableStores: [],
  isAllStores: true,
  canViewAll: false,
  setCurrentStoreId: () => {},
});

function readStoredId() {
  if (typeof window === 'undefined') return undefined;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === null ? undefined : v;
}

function writeStoredId(id) {
  if (typeof window === 'undefined') return;
  if (id === ALL_STORES) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, id);
}

export function CurrentStoreProvider({ children }) {
  const { user } = useAuthContext();
  const { has } = usePermission();

  const availableStores = useMemo(() => {
    const scope = user?.accessible_store_ids;
    if (!scope || scope === 'all') return mockStores;
    return mockStores.filter((s) => scope.includes(s.id));
  }, [user?.accessible_store_ids]);

  const canViewAll = has('store.view_all') || user?.accessible_store_ids === 'all';

  const [currentStoreId, setCurrentStoreIdState] = useState(ALL_STORES);

  // Bootstrap từ localStorage sau khi user & availableStores sẵn sàng.
  useEffect(() => {
    if (!user) return;
    const stored = readStoredId();
    if (stored === undefined) {
      setCurrentStoreIdState(canViewAll ? ALL_STORES : availableStores[0]?.id ?? ALL_STORES);
      return;
    }
    const isValid = availableStores.some((s) => s.id === stored);
    if (!isValid) {
      writeStoredId(ALL_STORES);
      setCurrentStoreIdState(canViewAll ? ALL_STORES : availableStores[0]?.id ?? ALL_STORES);
    } else {
      setCurrentStoreIdState(stored);
    }
  }, [user, availableStores, canViewAll]);

  const setCurrentStoreId = useCallback((id) => {
    setCurrentStoreIdState(id);
    writeStoredId(id);
  }, []);

  const currentStore = useMemo(
    () => (currentStoreId ? availableStores.find((s) => s.id === currentStoreId) ?? null : null),
    [currentStoreId, availableStores]
  );

  const value = useMemo(
    () => ({
      currentStoreId,
      currentStore,
      availableStores,
      isAllStores: currentStoreId === ALL_STORES,
      canViewAll,
      setCurrentStoreId,
    }),
    [currentStoreId, currentStore, availableStores, canViewAll, setCurrentStoreId]
  );

  return <CurrentStoreContext.Provider value={value}>{children}</CurrentStoreContext.Provider>;
}

export function useCurrentStore() {
  return useContext(CurrentStoreContext);
}
