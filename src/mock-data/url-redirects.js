// src/mock-data/url-redirects.js
// 301/302 redirects — SEO + legacy URL.

const day = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

export const mockUrlRedirects = [
  { _id: 'rd-001', id: 'rd-001', from: '/tet-2025',           to: '/tet-2026',                 type: 301, status: 'active',   hits: 12_400, created_at: day(400), updated_at: day(14) },
  { _id: 'rd-002', id: 'rd-002', from: '/valentine-cu',       to: '/valentine-2026',           type: 301, status: 'active',   hits: 3_200,  created_at: day(380), updated_at: day(7) },
  { _id: 'rd-003', id: 'rd-003', from: '/trang-suc-tron-bo',  to: '/collections',              type: 301, status: 'active',   hits: 8_900,  created_at: day(500), updated_at: day(500) },
  { _id: 'rd-004', id: 'rd-004', from: '/nhan-cuoi',          to: '/collections/wedding',      type: 301, status: 'active',   hits: 24_600, created_at: day(600), updated_at: day(600) },
  { _id: 'rd-005', id: 'rd-005', from: '/da-link-cu-black-fri',to: '/',                         type: 302, status: 'active',   hits: 1_200,  created_at: day(280), updated_at: day(280) },
  { _id: 'rd-006', id: 'rd-006', from: '/old-promotion',      to: '/khuyen-mai',               type: 301, status: 'active',   hits: 450,    created_at: day(720), updated_at: day(720) },
  { _id: 'rd-007', id: 'rd-007', from: '/cu-chinh-sach-bh',   to: '/chinh-sach-bao-hanh',      type: 301, status: 'active',   hits: 8_200,  created_at: day(900), updated_at: day(900) },
  { _id: 'rd-008', id: 'rd-008', from: '/goldprice',          to: '/gia-vang',                 type: 301, status: 'active',   hits: 6_400,  created_at: day(600), updated_at: day(600) },
  { _id: 'rd-009', id: 'rd-009', from: '/test-page',          to: '/',                         type: 302, status: 'inactive', hits: 20,     created_at: day(180), updated_at: day(90) },
  { _id: 'rd-010', id: 'rd-010', from: '/blog-old',           to: '/blog',                     type: 301, status: 'active',   hits: 3_600,  created_at: day(730), updated_at: day(730) },
];
