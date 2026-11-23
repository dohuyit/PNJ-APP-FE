import { OrderInfoView } from 'src/views/landing/account/order-info-view';
export const metadata = { title: 'Chi tiết đơn · PNJ' };
export default function Page({ params }) { return <OrderInfoView params={params} />; }
