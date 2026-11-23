// src/mock-data/collections.js
import { COLLECTION_IDS, BRAND_IDS } from './ids';

export const mockCollections = [
  {
    _id: COLLECTION_IDS.MY_FIRST_DIAMOND, id: COLLECTION_IDS.MY_FIRST_DIAMOND,
    name: 'My First Diamond', slug: 'my-first-diamond',
    short_description: 'Chiếc nhẫn kim cương đầu đời.',
    brand_id: BRAND_IDS.PNJ, status: 'active', is_new_badge: true,
    product_count: 32, sort: 1,
  },
  {
    _id: COLLECTION_IDS.HANH_PHUC, id: COLLECTION_IDS.HANH_PHUC,
    name: 'Hạnh Phúc', slug: 'hanh-phuc',
    short_description: 'Trọn vẹn hạnh phúc đôi lứa.',
    brand_id: BRAND_IDS.PNJ, status: 'active', is_wedding: true,
    product_count: 54, sort: 2,
  },
  {
    _id: COLLECTION_IDS.THANH_XUAN, id: COLLECTION_IDS.THANH_XUAN,
    name: 'Thanh Xuân', slug: 'thanh-xuan',
    short_description: 'Trang sức cho bạn gái trẻ.',
    brand_id: BRAND_IDS.STYLE, status: 'active',
    product_count: 86, sort: 3,
  },
  {
    _id: COLLECTION_IDS.WEDDING, id: COLLECTION_IDS.WEDDING,
    name: 'Trang sức cưới hỏi', slug: 'trang-suc-cuoi-hoi',
    short_description: 'Bộ sưu tập dành cho ngày trọng đại.',
    brand_id: BRAND_IDS.PNJ, status: 'active', is_wedding: true,
    product_count: 120, sort: 4,
  },
  {
    _id: COLLECTION_IDS.DISNEY_PRINCESS, id: COLLECTION_IDS.DISNEY_PRINCESS,
    name: 'Disney Princess', slug: 'disney-princess',
    short_description: 'Lấy cảm hứng từ các công chúa Disney.',
    brand_id: BRAND_IDS.DISNEY, status: 'active',
    product_count: 48, sort: 5,
  },
  {
    _id: COLLECTION_IDS.MANCODE, id: COLLECTION_IDS.MANCODE,
    name: 'MANCODE Collection', slug: 'mancode-collection',
    short_description: 'Khẳng định bản lĩnh phái mạnh.',
    brand_id: BRAND_IDS.MANCODE, status: 'active',
    product_count: 72, sort: 6,
  },
  {
    _id: COLLECTION_IDS.TET_2026, id: COLLECTION_IDS.TET_2026,
    name: 'Tết 2026', slug: 'tet-2026',
    short_description: 'Trang sức vàng mừng xuân.',
    brand_id: BRAND_IDS.PNJ, status: 'active', is_new_badge: true,
    product_count: 25, sort: 7,
  },
  {
    _id: COLLECTION_IDS.VALENTINE, id: COLLECTION_IDS.VALENTINE,
    name: 'Valentine 2026', slug: 'valentine-2026',
    short_description: 'Quà tặng ngày lễ tình nhân.',
    brand_id: BRAND_IDS.PNJ, status: 'active',
    product_count: 18, sort: 8,
  },
];
