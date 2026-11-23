import { OrderHistoryView } from 'src/views/landing/account/order-history-view';
export const metadata = { title: 'Đơn hàng của tôi · PNJ' };
export default function Page({ params }) { return <OrderHistoryView params={params} />; }
