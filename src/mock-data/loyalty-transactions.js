// src/mock-data/loyalty-transactions.js
// Giao dịch điểm — link customer_id + order_id.

import { mockOrders } from './orders';

export const mockLoyaltyTransactions = mockOrders.flatMap((o, i) => {
  const rows = [];
  const earnPoints = Math.floor(o.grand_total / 100_000);

  if (o.status === 'delivered' || o.status === 'confirmed') {
    rows.push({
      _id: `lt-earn-${i}`, id: `lt-earn-${i}`,
      code: `LTE${String(i + 1).padStart(5, '0')}`,
      customer_id: o.customer_id,
      order_id: o._id, order_no: o.order_no,
      type: 'earn',
      points: earnPoints,
      note: `Tích từ đơn ${o.order_no}`,
      balance_after: null,
      created_at: o.created_at,
    });
  }

  if (o.status === 'canceled' && earnPoints > 0) {
    rows.push({
      _id: `lt-revert-${i}`, id: `lt-revert-${i}`,
      code: `LTR${String(i + 1).padStart(5, '0')}`,
      customer_id: o.customer_id,
      order_id: o._id, order_no: o.order_no,
      type: 'revert',
      points: -earnPoints,
      note: `Hoàn điểm do huỷ đơn ${o.order_no}`,
      balance_after: null,
      created_at: o.created_at,
    });
  }

  // 10% orders dùng redeem
  if (i % 10 === 3) {
    rows.push({
      _id: `lt-redeem-${i}`, id: `lt-redeem-${i}`,
      code: `LTX${String(i + 1).padStart(5, '0')}`,
      customer_id: o.customer_id,
      order_id: o._id, order_no: o.order_no,
      type: 'redeem',
      points: -50,
      note: 'Đổi 50 điểm lấy voucher 50K',
      balance_after: null,
      created_at: o.created_at,
    });
  }

  return rows;
});
