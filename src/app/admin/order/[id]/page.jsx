import { OrderDetailPipelineView } from 'src/views/admin/order/order-detail-pipeline-view';
export const metadata = { title: 'Chi tiết đơn · PNJ Admin' };
export default function Page({ params }) { return <OrderDetailPipelineView id={params.id} />; }
