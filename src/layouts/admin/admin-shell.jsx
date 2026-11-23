// src/layouts/admin/admin-shell.jsx — chọn layout cho /admin: login no shell, còn lại DashboardLayout
'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { adminPaths } from 'src/routes/paths';
import { DashboardLayout } from 'src/layouts/dashboard';
import { usePermission } from 'src/auth/pnj/use-auth-context';
import { adminNavData, filterNavDataByPermissions } from './nav-config-admin';

export function AdminShell({ children }) {
  const pathname = usePathname();
  const { hasAny } = usePermission();

  const navData = useMemo(() => filterNavDataByPermissions(adminNavData, hasAny), [hasAny]);

  if (pathname.replace(/\/$/, '') === adminPaths.auth.login) return children;
  return <DashboardLayout slotProps={{ nav: { data: navData } }}>{children}</DashboardLayout>;
}
