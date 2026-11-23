// src/mock-data/pages.js
// Trang tĩnh storefront: About, Policy, Terms, FAQ wrapper.

const day = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

export const mockPages = [
  { _id: 'pg-about',       id: 'pg-about',       slug: 've-pnj',                title: 'Về PNJ',                          group: 'company', updated_at: day(30),  views: 120_000, status: 'published' },
  { _id: 'pg-mission',     id: 'pg-mission',     slug: 'su-menh',               title: 'Sứ mệnh & tầm nhìn',               group: 'company', updated_at: day(90),  views: 54_000,  status: 'published' },
  { _id: 'pg-store-list',  id: 'pg-store-list',  slug: 'he-thong-cua-hang',     title: 'Hệ thống cửa hàng',                group: 'company', updated_at: day(2),   views: 210_000, status: 'published' },
  { _id: 'pg-warranty',    id: 'pg-warranty',    slug: 'chinh-sach-bao-hanh',   title: 'Chính sách bảo hành',               group: 'policy',  updated_at: day(5),   views: 98_000,  status: 'published' },
  { _id: 'pg-return',      id: 'pg-return',      slug: 'chinh-sach-doi-tra',    title: 'Chính sách đổi trả',                group: 'policy',  updated_at: day(15),  views: 72_000,  status: 'published' },
  { _id: 'pg-privacy',     id: 'pg-privacy',     slug: 'chinh-sach-bao-mat',    title: 'Chính sách bảo mật',                group: 'policy',  updated_at: day(60),  views: 32_000,  status: 'published' },
  { _id: 'pg-terms',       id: 'pg-terms',       slug: 'dieu-khoan-su-dung',    title: 'Điều khoản sử dụng',                group: 'policy',  updated_at: day(60),  views: 28_000,  status: 'published' },
  { _id: 'pg-shipping',    id: 'pg-shipping',    slug: 'chinh-sach-giao-hang',  title: 'Chính sách giao hàng',              group: 'policy',  updated_at: day(20),  views: 65_000,  status: 'published' },
  { _id: 'pg-contact',     id: 'pg-contact',     slug: 'lien-he',               title: 'Liên hệ',                            group: 'support', updated_at: day(100), views: 180_000, status: 'published' },
  { _id: 'pg-size-guide',  id: 'pg-size-guide',  slug: 'huong-dan-chon-size',   title: 'Hướng dẫn chọn size',                group: 'support', updated_at: day(45),  views: 88_000,  status: 'published' },
  { _id: 'pg-care-guide',  id: 'pg-care-guide',  slug: 'cach-bao-quan-trang-suc', title: 'Cách bảo quản trang sức',           group: 'support', updated_at: day(50),  views: 42_000,  status: 'published' },
  { _id: 'pg-career',      id: 'pg-career',      slug: 'tuyen-dung',            title: 'Tuyển dụng',                        group: 'company', updated_at: day(10),  views: 15_000,  status: 'published' },
];
