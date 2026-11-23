import { MenuEditView } from 'src/views/admin/menu/menu-edit-view';

export const metadata = { title: 'Sửa menu · PNJ Admin' };

export default function Page({ params }) {
  return <MenuEditView location={params.location} />;
}
