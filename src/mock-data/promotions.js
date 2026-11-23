// src/mock-data/promotions.js
// 10 chương trình khuyến mãi — link product_ids từ PRODUCT_IDS + category/brand.

import { PRODUCT_IDS, CATEGORY_IDS, BRAND_IDS, COLLECTION_IDS } from './ids';

export const PROMOTION_IDS = {
  P1: 'promo-tet-2026',    P2: 'promo-valentine', P3: 'promo-83',
  P4: 'promo-83b',         P5: 'promo-wedding',   P6: 'promo-gold-day',
  P7: 'promo-flash-ring',  P8: 'promo-black-fri', P9: 'promo-new-collection',
  P10:'promo-loyalty',
};

const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

export const mockPromotions = [
  {
    _id: PROMOTION_IDS.P1, id: PROMOTION_IDS.P1, code: 'TET2026',
    name: 'Rộn ràng Tết 2026', description: 'Giảm 10% cho bộ sưu tập Tết — áp dụng toàn hệ thống',
    type: 'percent', discount_value: 10, max_discount: 2_000_000, min_order: 2_000_000,
    collection_ids: [COLLECTION_IDS.TET_2026], product_ids: PRODUCT_IDS.slice(0, 10),
    start_at: day(-14), end_at: day(14), status: 'active', priority: 100,
    used: 1240, budget: 500_000_000, usage_limit: null,
  },
  {
    _id: PROMOTION_IDS.P2, id: PROMOTION_IDS.P2, code: 'VAL14',
    name: 'Valentine đôi lứa', description: 'Giảm 500K cho cặp nhẫn cầu hôn',
    type: 'amount', discount_value: 500_000, min_order: 5_000_000,
    collection_ids: [COLLECTION_IDS.VALENTINE], product_ids: PRODUCT_IDS.slice(0, 6),
    start_at: day(-7), end_at: day(20), status: 'active', priority: 90,
    used: 320, budget: 150_000_000, usage_limit: 1000,
  },
  {
    _id: PROMOTION_IDS.P3, id: PROMOTION_IDS.P3, code: '83BK',
    name: '8/3 Phụ nữ rực rỡ', description: 'Giảm 15% dây chuyền + hoa tai nữ',
    type: 'percent', discount_value: 15, max_discount: 3_000_000, min_order: 3_000_000,
    category_ids: [CATEGORY_IDS.DAY_CHUYEN, CATEGORY_IDS.HOA_TAI], product_ids: [],
    start_at: day(10), end_at: day(25), status: 'scheduled', priority: 85,
    used: 0, budget: 400_000_000, usage_limit: null,
  },
  {
    _id: PROMOTION_IDS.P4, id: PROMOTION_IDS.P4, code: '83HM',
    name: '8/3 Ngày của Mẹ', description: 'Thẻ quà 300K cho hoá đơn > 10M',
    type: 'gift_card', discount_value: 300_000, min_order: 10_000_000,
    start_at: day(10), end_at: day(25), status: 'scheduled', priority: 80,
    used: 0, budget: 100_000_000, usage_limit: null,
  },
  {
    _id: PROMOTION_IDS.P5, id: PROMOTION_IDS.P5, code: 'WED26',
    name: 'Mùa cưới 2026', description: 'Giảm 1 triệu cho cặp nhẫn cưới + miễn phí khắc',
    type: 'amount', discount_value: 1_000_000, min_order: 10_000_000,
    collection_ids: [COLLECTION_IDS.WEDDING], product_ids: [],
    start_at: day(-30), end_at: day(60), status: 'active', priority: 70,
    used: 540, budget: 1_000_000_000, usage_limit: null,
  },
  {
    _id: PROMOTION_IDS.P6, id: PROMOTION_IDS.P6, code: 'GOLDDAY',
    name: 'Ngày Vàng PNJ', description: 'Giảm 2% công cho tất cả sản phẩm vàng 24K',
    type: 'percent', discount_value: 2, min_order: 0,
    category_ids: [CATEGORY_IDS.NHAN_VANG], product_ids: [],
    start_at: day(-3), end_at: day(1), status: 'active', priority: 65,
    used: 2100, budget: 300_000_000, usage_limit: null,
  },
  {
    _id: PROMOTION_IDS.P7, id: PROMOTION_IDS.P7, code: 'FLASH3H',
    name: 'Flash sale 3 giờ · nhẫn nữ', description: 'Giảm sốc 20% trong 3 giờ — sản phẩm giới hạn',
    type: 'percent', discount_value: 20, max_discount: 5_000_000, min_order: 2_000_000,
    product_ids: PRODUCT_IDS.slice(5, 12),
    start_at: day(2), end_at: day(2.125), status: 'scheduled', priority: 95,
    used: 0, budget: 80_000_000, usage_limit: 200,
  },
  {
    _id: PROMOTION_IDS.P8, id: PROMOTION_IDS.P8, code: 'BLACKFRI',
    name: 'Black Friday PNJ', description: 'Giảm tới 25% toàn bộ bộ trang sức',
    type: 'percent', discount_value: 25, max_discount: 10_000_000, min_order: 5_000_000,
    category_ids: [CATEGORY_IDS.TRANG_SUC], product_ids: [],
    start_at: day(-280), end_at: day(-275), status: 'ended', priority: 50,
    used: 4800, budget: 2_500_000_000, usage_limit: null,
  },
  {
    _id: PROMOTION_IDS.P9, id: PROMOTION_IDS.P9, code: 'NEWCOL',
    name: 'Ra mắt BST "Hạnh Phúc"', description: 'Tặng dây chuyền bạc khi mua BST Hạnh Phúc',
    type: 'gift_product', discount_value: 0, min_order: 7_000_000,
    collection_ids: [COLLECTION_IDS.HANH_PHUC], product_ids: [],
    start_at: day(-20), end_at: day(40), status: 'active', priority: 75,
    used: 180, budget: null, usage_limit: 500,
  },
  {
    _id: PROMOTION_IDS.P10, id: PROMOTION_IDS.P10, code: 'VIPMEM',
    name: 'Ưu đãi hạng Vàng/Bạch Kim', description: 'Giảm thêm 5% cho khách hàng hạng Vàng trở lên',
    type: 'percent', discount_value: 5, min_order: 0,
    start_at: day(-60), end_at: day(300), status: 'active', priority: 40,
    used: 6200, budget: null, usage_limit: null,
    tier_restriction: ['gold', 'platinum'],
  },
];
