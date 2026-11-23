// src/mock-data/coupons.js
// Mã giảm — có thể gắn với promotion hoặc độc lập.
import { PROMOTION_IDS } from './promotions';

const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

export const COUPON_IDS = {
  C1:'cp-tet200',   C2:'cp-vip100',  C3:'cp-newbie',    C4:'cp-free-ship',
  C5:'cp-flash500', C6:'cp-wed1m',   C7:'cp-83-15',     C8:'cp-blackfri',
};

export const mockCoupons = [
  { _id: COUPON_IDS.C1, id: COUPON_IDS.C1, code: 'TET200',    name: 'Mã Tết 200K',          promotion_id: PROMOTION_IDS.P1,  type: 'amount',  value: 200_000, min_order: 2_000_000, usage_limit: 5000, used: 1240, status: 'active',   start_at: day(-14), end_at: day(14) },
  { _id: COUPON_IDS.C2, id: COUPON_IDS.C2, code: 'VIP100',    name: 'VIP 100K',             promotion_id: null,              type: 'amount',  value: 100_000, min_order: 1_000_000, usage_limit: null, used: 850,  status: 'active',   start_at: day(-30), end_at: day(60) },
  { _id: COUPON_IDS.C3, id: COUPON_IDS.C3, code: 'NEWBIE50', name: 'Khách mới giảm 50K',    promotion_id: null,              type: 'amount',  value: 50_000,  min_order: 500_000,   usage_limit: null, used: 3800, status: 'active',   start_at: day(-180), end_at: day(365), one_per_customer: true },
  { _id: COUPON_IDS.C4, id: COUPON_IDS.C4, code: 'FREESHIP', name: 'Miễn phí vận chuyển',   promotion_id: null,              type: 'free_ship', value: 0,     min_order: 2_000_000, usage_limit: null, used: 6200, status: 'active',   start_at: day(-180), end_at: day(365) },
  { _id: COUPON_IDS.C5, id: COUPON_IDS.C5, code: 'FLASH500', name: 'Flash sale 500K',      promotion_id: PROMOTION_IDS.P7,  type: 'amount',  value: 500_000, min_order: 2_000_000, usage_limit: 200,  used: 0,    status: 'scheduled', start_at: day(2),  end_at: day(2.125) },
  { _id: COUPON_IDS.C6, id: COUPON_IDS.C6, code: 'WED1M',    name: 'Cưới giảm 1 triệu',     promotion_id: PROMOTION_IDS.P5,  type: 'amount',  value: 1_000_000, min_order: 10_000_000, usage_limit: null, used: 540,  status: 'active',   start_at: day(-30), end_at: day(60) },
  { _id: COUPON_IDS.C7, id: COUPON_IDS.C7, code: '83GIFT15', name: '8/3 Giảm 15%',          promotion_id: PROMOTION_IDS.P3,  type: 'percent', value: 15,      min_order: 3_000_000, usage_limit: null, used: 0,    status: 'scheduled', start_at: day(10), end_at: day(25) },
  { _id: COUPON_IDS.C8, id: COUPON_IDS.C8, code: 'BLACKFRI', name: 'Black Friday',          promotion_id: PROMOTION_IDS.P8,  type: 'percent', value: 25,      min_order: 5_000_000, usage_limit: null, used: 4800, status: 'ended',    start_at: day(-280), end_at: day(-275) },
];
