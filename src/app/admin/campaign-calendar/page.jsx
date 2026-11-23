import { CampaignCalendarView } from 'src/views/admin/content/campaign-calendar-view';
import { PermissionGate } from 'src/components/common/can';

export const metadata = { title: 'Lịch chiến dịch · PNJ Admin' };

export default function Page() {
  return (
    <PermissionGate permissions={['banner.view', 'landing_page.view']}>
      <CampaignCalendarView />
    </PermissionGate>
  );
}
