// src/mock-data/banners.js
// Banner storefront — link promotion/landing/category target.

import { PROMOTION_IDS } from './promotions';
import { COLLECTION_IDS, CATEGORY_IDS } from './ids';

const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

export const BANNER_IDS = {
  B1:'ban-hero-tet', B2:'ban-hero-val', B3:'ban-hero-wed', B4:'ban-strip-free-ship',
  B5:'ban-hero-83',  B6:'ban-category-ring', B7:'ban-gift-card', B8:'ban-gold-day',
};

export const mockBanners = [
  { _id: BANNER_IDS.B1, id: BANNER_IDS.B1, code: 'HERO_TET',    name: 'Hero · Tết 2026',       position: 'home_hero',    image: '', link_type: 'promotion', link_id: PROMOTION_IDS.P1, priority: 10, start_at: day(-14), end_at: day(14), status: 'active',    device: 'both',    impressions: 48200, clicks: 3120 },
  { _id: BANNER_IDS.B2, id: BANNER_IDS.B2, code: 'HERO_VAL',    name: 'Hero · Valentine',      position: 'home_hero',    image: '', link_type: 'collection', link_id: COLLECTION_IDS.VALENTINE, priority: 9,  start_at: day(-7),  end_at: day(20), status: 'active',    device: 'both',    impressions: 29100, clicks: 1890 },
  { _id: BANNER_IDS.B3, id: BANNER_IDS.B3, code: 'HERO_WED',    name: 'Hero · Mùa cưới',       position: 'home_hero',    image: '', link_type: 'collection', link_id: COLLECTION_IDS.WEDDING,   priority: 8,  start_at: day(-30), end_at: day(60), status: 'active',    device: 'both',    impressions: 56300, clicks: 4620 },
  { _id: BANNER_IDS.B4, id: BANNER_IDS.B4, code: 'STRIP_SHIP',  name: 'Strip · Miễn phí ship', position: 'home_strip',   image: '', link_type: 'static',    link_id: null,                     priority: 5,  start_at: day(-180),end_at: day(365),status: 'active',    device: 'both',    impressions: 320_000, clicks: 12_400 },
  { _id: BANNER_IDS.B5, id: BANNER_IDS.B5, code: 'HERO_83',     name: 'Hero · 8/3',            position: 'home_hero',    image: '', link_type: 'promotion', link_id: PROMOTION_IDS.P3,         priority: 8,  start_at: day(10),  end_at: day(25), status: 'scheduled', device: 'both',    impressions: 0, clicks: 0 },
  { _id: BANNER_IDS.B6, id: BANNER_IDS.B6, code: 'CAT_RING',    name: 'Category · Nhẫn',       position: 'category_top', image: '', link_type: 'category',  link_id: CATEGORY_IDS.NHAN,        priority: 3,  start_at: day(-180),end_at: day(365),status: 'active',    device: 'both',    impressions: 18_200, clicks: 920 },
  { _id: BANNER_IDS.B7, id: BANNER_IDS.B7, code: 'POPUP_GIFT',  name: 'Popup · Thẻ quà',       position: 'popup',        image: '', link_type: 'static',    link_id: null,                     priority: 2,  start_at: day(-30), end_at: day(30), status: 'active',    device: 'desktop', impressions: 8_400, clicks: 420 },
  { _id: BANNER_IDS.B8, id: BANNER_IDS.B8, code: 'STRIP_GOLD',  name: 'Strip · Ngày vàng',     position: 'home_strip',   image: '', link_type: 'promotion', link_id: PROMOTION_IDS.P6,         priority: 7,  start_at: day(-3),  end_at: day(1),  status: 'active',    device: 'both',    impressions: 12_300, clicks: 1_540 },
];
