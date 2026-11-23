import { PeopleHubView } from 'src/views/admin/admin-user/people-hub-view';
import { PermissionGate } from 'src/components/common/can';

export const metadata = { title: 'Nhân sự · PNJ Admin' };

export default function Page() {
  return (
    <PermissionGate permissions={['admin_user.view', 'role.view']}>
      <PeopleHubView defaultTab="admins" />
    </PermissionGate>
  );
}
