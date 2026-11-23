// src/mock-data/payment-transactions.js
// Tạo transaction từ mỗi order có payment_status !== 'pending'.
// Link: order_id → mockOrders, method_id → PAYMENT_METHOD_IDS.

import { mockOrders } from './orders';
import { PAYMENT_METHOD_IDS } from './payment-methods';

const MAP = {
  cod:      PAYMENT_METHOD_IDS.COD,
  vnpay:    PAYMENT_METHOD_IDS.VNPAY,
  momo:     PAYMENT_METHOD_IDS.MOMO,
  zalopay:  PAYMENT_METHOD_IDS.ZALOPAY,
  card_intl:PAYMENT_METHOD_IDS.CARD_INTL,
};

export const mockPaymentTransactions = mockOrders.map((o, i) => {
  const method = MAP[o.payment?.method] ?? PAYMENT_METHOD_IDS.VNPAY;
  const payStatus = o.payment?.status ?? (o.status === 'delivered' || o.status === 'confirmed' ? 'paid' : o.status === 'canceled' ? 'refunded' : 'pending');
  const txStatus = payStatus === 'paid' ? 'success'
    : payStatus === 'refunded' ? 'refunded'
    : payStatus === 'pending' ? 'pending'
    : 'failed';
  return {
    _id: `tx-${String(i + 1).padStart(5, '0')}`,
    id: `tx-${String(i + 1).padStart(5, '0')}`,
    code: `TX${String(i + 1).padStart(7, '0')}`,
    order_id: o._id,
    order_no: o.order_no,
    customer_id: o.customer_id,
    method_id: method,
    gateway_ref: `GW-${Math.floor(Math.random() * 9e6 + 1e6)}`,
    amount: o.grand_total,
    fee: Math.round(o.grand_total * 0.012),
    net_amount: o.grand_total - Math.round(o.grand_total * 0.012),
    status: txStatus,
    attempt: txStatus === 'failed' ? 2 : 1,
    created_at: o.created_at,
    settled_at: txStatus === 'success' ? new Date(new Date(o.created_at).getTime() + 2 * 3600_000).toISOString() : null,
  };
});
