// src/components/common/can/can.jsx — permission gate
// Dùng được 3 cách:
//   <Can ability="product.create">...</Can>                      (1 quyền)
//   <Can permissions={['a','b']}>...</Can>                       (mặc định any)
//   <Can permissions={['a','b']} mode="all">...</Can>            (yêu cầu tất cả)
'use client';

import { usePermission } from 'src/auth/pnj/use-auth-context';

export function Can({ ability, permissions, mode = 'any', children, fallback = null }) {
  const { has, hasAny, hasAll } = usePermission();

  const keys = permissions ?? (ability ? [ability] : []);
  if (keys.length === 0) return children;

  const ok = mode === 'all' ? hasAll(keys) : (keys.length === 1 ? has(keys[0]) : hasAny(keys));
  return ok ? children : fallback;
}
