// src/mock-data/orders.js
// 25 đơn hàng — shape giàu để khớp với admin order views (buyer/amounts/payment/fulfillment nested).
import { mockCustomers } from './customers';
import { mockVariants } from './variants';
import { mockStores } from './stores';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'canceled'];
const PAYMENTS = ['cod', 'vnpay', 'momo', 'zalopay', 'card_intl'];
const CHANNELS = ['web', 'store_order', 'hotline'];
const FULFILL_METHODS = ['delivery', 'pickup'];

const STATUS_LABEL = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã huỷ',
};

export const mockOrders = [];

for (let i = 0; i < 25; i += 1) {
  const customer = mockCustomers[i % mockCustomers.length];
  const itemsCount = 1 + (i % 3);
  const items = Array.from({ length: itemsCount }, (_, j) => {
    const variant = mockVariants[(i * 3 + j) % mockVariants.length];
    return {
      variant_id: variant._id,
      sku: variant.sku,
      product_name: variant.product_name ?? variant.name ?? `SP ${variant.sku}`,
      qty: 1 + (j % 2),
      price: variant.price,
      total: (1 + (j % 2)) * variant.price,
    };
  });

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const discount = i % 4 === 0 ? 200_000 : 0;
  const shipping_fee = 30_000;
  const vat = Math.round(subtotal * 0.08);
  const grand_total = subtotal + shipping_fee + vat - discount;

  const status = STATUSES[i % STATUSES.length];
  const store = mockStores[i % mockStores.length];
  const fulfillMethod = FULFILL_METHODS[i % FULFILL_METHODS.length];
  const createdAt = new Date(Date.now() - i * 1000 * 60 * 60 * 12).toISOString();

  const paymentStatus =
    status === 'delivered' || status === 'confirmed' ? 'paid'
      : status === 'canceled' ? 'refunded'
      : 'pending';

  // Status history: chronological trail up to current status
  const statusChain = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];
  const statusIdx = statusChain.indexOf(status);
  const historyBase = statusIdx >= 0 ? statusChain.slice(0, statusIdx + 1) : [status];
  const status_history = historyBase.map((s, k) => ({
    status: s,
    label: STATUS_LABEL[s] ?? s,
    at: new Date(Date.now() - (i * 12 - k * 2) * 3600_000).toISOString(),
    actor: k === 0 ? 'system' : 'admin',
  }));

  mockOrders.push({
    _id: `order-${String(1000 + i).padStart(4, '0')}`,
    id: `order-${String(1000 + i).padStart(4, '0')}`,
    order_no: `DH${String(1000 + i).padStart(6, '0')}`,
    // Giữ `code` để chỗ nào dùng tên cũ không vỡ
    code: `DH${String(1000 + i).padStart(6, '0')}`,
    status,
    channel: CHANNELS[i % CHANNELS.length],
    created_at: createdAt,
    customer_id: customer._id,

    buyer: {
      full_name: customer.name,
      phone: customer.phone,
      email: customer.email ?? (i % 3 === 0 ? `${customer.name?.toLowerCase?.().replace(/\s+/g, '.')}@pnj.local` : null),
    },

    items,
    items_count: itemsCount,
    item_count: itemsCount,
    first_item: items[0],

    amounts: {
      subtotal,
      discount,
      shipping_fee,
      vat,
      grand_total,
    },

    payment: {
      method_code: PAYMENTS[i % PAYMENTS.length],
      status: paymentStatus,
    },

    fulfillment: {
      method: fulfillMethod,
      express_3h: i % 5 === 0,
      pickup_store_snapshot: fulfillMethod === 'pickup'
        ? { id: store._id, name: store.name }
        : null,
      shipping_address: fulfillMethod === 'delivery' ? {
        street: `${100 + i} Nguyễn Trãi`,
        ward_name: 'Phường Bến Thành',
        district_name: 'Quận 1',
        province_name: 'TP.HCM',
      } : null,
    },

    promotions_applied: discount > 0 ? [{
      code: `SALE${i}`,
      name: `Ưu đãi ${i % 10 + 1}`,
      amount: discount,
    }] : [],

    status_history,

    ecard: {
      enabled: i % 7 === 0,
      recipient_phone: i % 7 === 0 ? customer.phone : '',
      message: i % 7 === 0 ? 'Chúc mừng sinh nhật!' : '',
    },

    promo_code: discount > 0 ? `SALE${i}` : null,

    // Legacy flat fields — một số view/hook cũ vẫn tham chiếu.
    customer_name: customer.name,
    customer_phone: customer.phone,
    store_id: store._id,
    store_name: store.name,
    subtotal,
    shipping_fee,
    discount,
    total: grand_total,
    payment_method: PAYMENTS[i % PAYMENTS.length],
    payment_status: paymentStatus,
  });
}
