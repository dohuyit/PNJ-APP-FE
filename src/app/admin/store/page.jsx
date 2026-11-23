import { LocationHubView } from 'src/views/admin/store/location-hub-view';
import { PermissionGate } from 'src/components/common/can';

export const metadata = { title: 'Chi nhánh · PNJ Admin' };

export default function Page() {
  return (
    <PermissionGate permissions={['store.view', 'store.create', 'store.update', 'store.delete']}>
      <LocationHubView defaultTab="stores" />
    </PermissionGate>
  );
}
