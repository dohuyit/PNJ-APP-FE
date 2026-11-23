import { ContentDashboardView } from 'src/views/admin/content/content-dashboard-view';
import { PermissionGate } from 'src/components/common/can';

export const metadata = { title: 'Tổng quan CMS · PNJ Admin' };

export default function Page() {
  return (
    <PermissionGate permissions={['banner.view', 'landing_page.view', 'page.view']}>
      <ContentDashboardView />
    </PermissionGate>
  );
}
