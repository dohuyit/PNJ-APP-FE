import { Customer360View } from 'src/views/admin/customer/customer-360-view';
export const metadata = { title: 'Chi tiết khách · PNJ Admin' };
export default function Page({ params }) { return <Customer360View id={params.id} />; }
