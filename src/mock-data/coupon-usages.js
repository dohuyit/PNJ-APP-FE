// src/mock-data/coupon-usages.js
// Nhật ký sử dụng coupon — link order, customer, coupon.

import { mockCoupons, COUPON_IDS } from './coupons';
import { mockOrders } from './orders';

// Lấy 15 order đầu để tạo usage
export const mockCouponUsages = mockOrders.slice(0, 15).map((o, i) => {
  const coupon = mockCoupons[i % mockCoupons.length];
  return {
    _id: `cu-${String(i + 1).padStart(4, '0')}`,
    id: `cu-${String(i + 1).padStart(4, '0')}`,
    coupon_id: coupon._id,
    coupon_code: coupon.code,
    order_id: o._id,
    order_no: o.order_no,
    customer_id: o.customer_id,
    customer_name: o.buyer.full_name,
    discount: coupon.type === 'percent'
      ? Math.round(o.subtotal * coupon.value / 100)
      : coupon.type === 'free_ship' ? 30_000 : coupon.value,
    status: o.status === 'canceled' ? 'reverted' : 'applied',
    used_at: o.created_at,
  };
});

export { COUPON_IDS };
