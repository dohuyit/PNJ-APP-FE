// src/app/admin/layout.jsx — wraps every /admin/** page with AuthProvider + shell + guard
import { AuthProvider } from 'src/auth/pnj/auth-provider';
import { AdminShell } from 'src/layouts/admin/admin-shell';
import { AdminAuthGuard } from 'src/layouts/admin/admin-auth-guard';
import { CurrentStoreProvider } from 'src/contexts/current-store';

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: 'PNJ Admin',
};

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <AdminAuthGuard>
        <CurrentStoreProvider>
          <AdminShell>{children}</AdminShell>
        </CurrentStoreProvider>
      </AdminAuthGuard>
    </AuthProvider>
  );
}
