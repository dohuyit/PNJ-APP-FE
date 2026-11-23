// src/mock-data/return-requests.js
// Yêu cầu thu đổi/hoàn tiền — link order_id, customer_id.

import { mockOrders } from './orders';

const REASONS = [
  'Không vừa size',
  'Thay đổi quyết định',
  'Thiết kế không đúng kỳ vọng',
  'Sản phẩm có lỗi — xước',
  'Đổi sang mẫu khác',
  'Thu đổi lên mẫu cao hơn',
  'Phai màu sau 1 tuần',
];

const STATUS_FLOW = ['received', 'reviewing', 'approved', 'completed', 'rejected'];

export const mockReturnRequests = mockOrders
  .filter((o) => o.status === 'delivered' || o.status === 'canceled')
  .slice(0, 10)
  .map((o, i) => {
    const type = i % 3 === 0 ? 'exchange' : i % 3 === 1 ? 'refund' : 'warranty';
    const status = STATUS_FLOW[i % STATUS_FLOW.length];
    return {
      _id: `rr-${String(i + 1).padStart(4, '0')}`,
      id: `rr-${String(i + 1).padStart(4, '0')}`,
      code: `YCRR${String(100 + i).padStart(5, '0')}`,
      order_id: o._id,
      order_no: o.order_no,
      customer_id: o.customer_id,
      customer_name: o.buyer.full_name,
      customer_phone: o.buyer.phone,
      type,
      reason: REASONS[i % REASONS.length],
      requested_amount: type === 'refund' ? o.grand_total : null,
      refund_amount: status === 'completed' && type === 'refund' ? o.grand_total : null,
      status,
      items: o.items.slice(0, 1).map((it) => ({
        sku: it.sku,
        product_name: it.product_name,
        qty: it.qty,
        reason: REASONS[i % REASONS.length],
      })),
      channel: o.channel,
      store_id: o.store_id,
      handler: 'Lê Quốc Khánh',
      created_at: new Date(new Date(o.created_at).getTime() + 3 * 86_400_000).toISOString(),
      resolved_at: ['completed','rejected'].includes(status)
        ? new Date(new Date(o.created_at).getTime() + 7 * 86_400_000).toISOString()
        : null,
    };
  });
