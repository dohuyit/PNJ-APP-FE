// src/layouts/admin/admin-auth-guard.jsx — redirect to login if no session
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SplashScreen } from 'src/components/loading-screen';
import { useAuthContext } from 'src/auth/pnj/use-auth-context';
import { adminPaths } from 'src/routes/paths';

export function AdminAuthGuard({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  // next.config `trailingSlash: true` → pathname có đuôi `/`, strip trước khi so.
  const isLoginPage = pathname.replace(/\/$/, '') === adminPaths.auth.login;

  useEffect(() => {
    if (!loading && !user && !isLoginPage) router.replace(adminPaths.auth.login);
    if (!loading && user && isLoginPage) router.replace(adminPaths.dashboard);
  }, [loading, user, isLoginPage, router]);

  if (loading) return <SplashScreen />;
  if (!user && !isLoginPage) return null;
  return children;
}
