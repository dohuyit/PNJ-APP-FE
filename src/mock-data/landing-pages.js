// src/mock-data/landing-pages.js
// Landing page builder — link promotion/collection.

import { PROMOTION_IDS } from './promotions';
import { COLLECTION_IDS } from './ids';

const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

export const mockLandingPages = [
  { _id: 'lp-tet-2026',    id: 'lp-tet-2026',    slug: 'tet-2026',          title: 'Ron ràng Tết 2026 — ưu đãi khai xuân', promotion_id: PROMOTION_IDS.P1, collection_id: COLLECTION_IDS.TET_2026, status: 'published', published_at: day(-14), updated_at: day(-2),  views: 42_300, conversion: 3.2, author: 'Trần Thị Mai Anh' },
  { _id: 'lp-valentine',   id: 'lp-valentine',   slug: 'valentine-2026',    title: 'Trao yêu thương Valentine',             promotion_id: PROMOTION_IDS.P2, collection_id: COLLECTION_IDS.VALENTINE, status: 'published', published_at: day(-7),  updated_at: day(-1),  views: 18_900, conversion: 4.8, author: 'Ngô Phương Linh' },
  { _id: 'lp-wedding',     id: 'lp-wedding',     slug: 'mua-cuoi-2026',     title: 'Mùa cưới PNJ 2026 — khởi đầu hạnh phúc', promotion_id: PROMOTION_IDS.P5, collection_id: COLLECTION_IDS.WEDDING,   status: 'published', published_at: day(-30), updated_at: day(-5),  views: 62_100, conversion: 5.4, author: 'Trần Thị Mai Anh' },
  { _id: 'lp-83',          id: 'lp-83',          slug: '8-3-2026',          title: 'Phụ nữ rực rỡ · 8/3 2026',              promotion_id: PROMOTION_IDS.P3, collection_id: null,                      status: 'scheduled', published_at: day(10),  updated_at: day(0),   views: 0,      conversion: 0,   author: 'Ngô Phương Linh' },
  { _id: 'lp-gift-card',   id: 'lp-gift-card',   slug: 'the-qua-pnj',       title: 'Thẻ quà PNJ — món quà tinh tế',         promotion_id: null,             collection_id: null,                      status: 'published', published_at: day(-120),updated_at: day(-15), views: 9_200,  conversion: 2.1, author: 'Trần Thị Mai Anh' },
  { _id: 'lp-member-club', id: 'lp-member-club', slug: 'cau-lac-bo',        title: 'Câu lạc bộ khách hàng thân thiết',       promotion_id: PROMOTION_IDS.P10, collection_id: null,                     status: 'published', published_at: day(-60), updated_at: day(-7),  views: 15_800, conversion: 6.2, author: 'Lưu Khả Ngân' },
  { _id: 'lp-black-fri',   id: 'lp-black-fri',   slug: 'black-friday-2025', title: 'Black Friday 2025 — sale lớn nhất năm', promotion_id: PROMOTION_IDS.P8, collection_id: null,                     status: 'archived',  published_at: day(-280),updated_at: day(-270),views: 180_200,conversion: 7.1, author: 'Trần Thị Mai Anh' },
  { _id: 'lp-flash-ring',  id: 'lp-flash-ring',  slug: 'flash-sale-nhan',   title: 'Flash sale 3 giờ nhẫn nữ',               promotion_id: PROMOTION_IDS.P7, collection_id: null,                     status: 'draft',     published_at: null,     updated_at: day(0),   views: 0,      conversion: 0,   author: 'Ngô Phương Linh' },
];
