// src/mock-data/consents.js
// Chính sách đồng thuận thu thập dữ liệu — có version, audit.

const day = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

export const mockConsents = [
  { _id: 'cs-privacy',    id: 'cs-privacy',    code: 'privacy_policy',  name: 'Chính sách bảo mật',      version: 'v3.1', is_required: true,  display_at: 'signup',      accept_count: 48_200, reject_count: 120, updated_at: day(60),  published_at: day(60),  status: 'active' },
  { _id: 'cs-marketing',  id: 'cs-marketing',  code: 'marketing_consent',name: 'Nhận email khuyến mãi',   version: 'v2.0', is_required: false, display_at: 'signup',      accept_count: 32_100, reject_count: 16_000, updated_at: day(90),  published_at: day(90),  status: 'active' },
  { _id: 'cs-sms',        id: 'cs-sms',        code: 'sms_consent',      name: 'Nhận SMS từ PNJ',        version: 'v1.5', is_required: false, display_at: 'checkout',    accept_count: 28_500, reject_count: 18_700, updated_at: day(120), published_at: day(120), status: 'active' },
  { _id: 'cs-cookie',     id: 'cs-cookie',     code: 'cookie_banner',    name: 'Chấp nhận cookie',        version: 'v1.0', is_required: true,  display_at: 'first_visit', accept_count: 240_000,reject_count: 12_000, updated_at: day(180), published_at: day(180), status: 'active' },
  { _id: 'cs-loyalty',    id: 'cs-loyalty',    code: 'loyalty_terms',    name: 'Điều khoản chương trình TV',version: 'v2.2',is_required: true,  display_at: 'join_tier',   accept_count: 58_000, reject_count: 230,    updated_at: day(45),  published_at: day(45),  status: 'active' },
  { _id: 'cs-share-3rd',  id: 'cs-share-3rd',  code: 'share_third_party',name: 'Chia sẻ dữ liệu bên thứ ba',version: 'v1.1',is_required: false, display_at: 'account',     accept_count: 8_200,  reject_count: 42_000, updated_at: day(200), published_at: day(200), status: 'active' },
];
