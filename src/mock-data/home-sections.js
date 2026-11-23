// src/mock-data/home-sections.js
// Các section trang chủ builder — link category/collection/promotion.

import { PROMOTION_IDS } from './promotions';
import { COLLECTION_IDS, CATEGORY_IDS, PRODUCT_IDS } from './ids';

export const mockHomeSections = [
  { _id: 'hs-01', id: 'hs-01', code: 'hero-carousel',    name: 'Carousel Hero',             type: 'hero_carousel',    data_source: 'banner', filter: { position: 'home_hero' }, sort: 1, status: 'active' },
  { _id: 'hs-02', id: 'hs-02', code: 'strip-notice',     name: 'Strip thông báo',           type: 'strip_bar',        data_source: 'banner', filter: { position: 'home_strip' }, sort: 2, status: 'active' },
  { _id: 'hs-03', id: 'hs-03', code: 'featured-brands',  name: 'Thương hiệu nổi bật',       type: 'brand_grid',       data_source: 'brand',  filter: { featured: true }, sort: 3, status: 'active' },
  { _id: 'hs-04', id: 'hs-04', code: 'new-arrivals',     name: 'Sản phẩm mới',              type: 'product_scroll',   data_source: 'product', filter: { is_new: true },  limit: 12, sort: 4, status: 'active' },
  { _id: 'hs-05', id: 'hs-05', code: 'best-sellers',     name: 'Bán chạy nhất',             type: 'product_grid',     data_source: 'product', filter: { is_best_seller: true }, limit: 8, sort: 5, status: 'active' },
  { _id: 'hs-06', id: 'hs-06', code: 'tet-collection',   name: 'BST Tết 2026',              type: 'collection_card',  data_source: 'collection', collection_id: COLLECTION_IDS.TET_2026, sort: 6, status: 'active' },
  { _id: 'hs-07', id: 'hs-07', code: 'promo-highlight',  name: 'Ưu đãi hot',                type: 'promotion_banner', data_source: 'promotion', promotion_id: PROMOTION_IDS.P1, sort: 7, status: 'active' },
  { _id: 'hs-08', id: 'hs-08', code: 'category-tiles',   name: 'Danh mục chính',            type: 'category_tiles',   data_source: 'category', filter: { parent: null }, limit: 6, sort: 8, status: 'active' },
  { _id: 'hs-09', id: 'hs-09', code: 'editor-pick',      name: 'Editor chọn lọc',           type: 'product_grid',     data_source: 'product', explicit_ids: PRODUCT_IDS.slice(0, 6), sort: 9, status: 'active' },
  { _id: 'hs-10', id: 'hs-10', code: 'blog-latest',      name: 'Blog mới nhất',             type: 'post_scroll',      data_source: 'post', filter: { status: 'published' }, limit: 6, sort: 10, status: 'active' },
  { _id: 'hs-11', id: 'hs-11', code: 'wedding-corner',   name: 'Góc cưới hỏi',              type: 'collection_card',  data_source: 'collection', collection_id: COLLECTION_IDS.WEDDING, sort: 11, status: 'draft' },
  { _id: 'hs-12', id: 'hs-12', code: 'cat-ring-focus',   name: 'Nhẫn nổi bật',              type: 'category_focus',   data_source: 'category', category_id: CATEGORY_IDS.NHAN, sort: 12, status: 'active' },
];
