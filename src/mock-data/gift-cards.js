// src/mock-data/gift-cards.js
// Thẻ quà vật lý + e-gift — link customer (chủ thẻ / người nhận).

import { mockCustomers } from './customers';

const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

export const GIFT_CARD_IDS = {
  GC1: 'gc-10001', GC2: 'gc-10002', GC3: 'gc-10003', GC4: 'gc-10004', GC5: 'gc-10005',
  GC6: 'gc-10006', GC7: 'gc-10007', GC8: 'gc-10008', GC9: 'gc-10009', GC10:'gc-10010',
  GC11:'gc-10011', GC12:'gc-10012',
};

const designs = ['Hoa đào Tết', 'Tình yêu Valentine', 'Mẹ yêu 8/3', 'Hạnh phúc đôi lứa', 'Classic đỏ', 'Classic xanh'];

export const mockGiftCards = Object.values(GIFT_CARD_IDS).map((id, i) => {
  const customer = mockCustomers[i % mockCustomers.length];
  const amount = [500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000][i % 5];
  const used = i % 3 === 0 ? amount : i % 3 === 1 ? Math.round(amount * 0.5) : 0;
  return {
    _id: id, id,
    code: id.toUpperCase().replace('GC-', 'GC'),
    type: i % 2 === 0 ? 'physical' : 'e_gift',
    design_name: designs[i % designs.length],
    face_value: amount,
    balance: amount - used,
    issued_to_customer_id: customer._id,
    issued_to_name: customer.name,
    issued_at: day(-i * 5),
    expired_at: day(365 - i * 5),
    status: used === amount ? 'used_up' : used > 0 ? 'partial' : 'active',
    channel: i % 4 === 0 ? 'store' : 'web',
  };
});
